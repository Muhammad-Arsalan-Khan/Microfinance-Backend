import User from "../models/userSchema.js"
import { userValidationSchema } from "../validation/userValidation.js"
import bcrypt from "bcryptjs"
import { setUser, setAdmin } from "../utils/jwt.js"
import { verifyEmail } from "../nodemailer/nodemailer.js"
import { create } from "qrcode"
import EmailOTP from "../models/emailSchema.js"

let otpGenrate = Math.floor(100000 + Math.random() * 900000)

async function login(req, res) {
  try {
    const { email, cnic, password } = req.body

    if (!email || !password || !cnic) {
      return res.status(400).json({ message: "field are required" })
    }

    const existingUser = await User.findOne({
      $and: [{ email }, { cnic }],
    });

    if (!existingUser) {
      return res.status(400).json({
        message: "account does not exists",
      });
    }

    if (!existingUser.isVerified) {
      await verifyEmail(existingUser.email, otpGenrate)
      return res.status(401).json({
        message: "unAuthorized user",
        data: existingUser._id,
        email: existingUser.email
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "invalid email password" })
    }
    const userData = {
      username: existingUser.name,
      email: existingUser.email,
      id: existingUser._id,
      phone: existingUser.phone,
      address: existingUser.address,
      city: existingUser.city,
      country: existingUser.country,
      isVerified: existingUser.isVerified,
      isAdmin: existingUser.isAdmin,
      cnic: existingUser.cnic,
      createdAt: existingUser.createdAt,
      loanCompleted: existingUser.loanCompleted,
      loanId: existingUser.loanId,
    };
    const id = userData.id
    const token = setUser(id)
    // res.cookie("token", token
    // ,{
    // httpOnly: true, 
    // secure: true,
    // sameSite: 'None',
    // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    // domain: 'microfinanc.netlify.app'
    // }
    //)
    let Verified;
    if (existingUser.isAdmin) {
      const isVerified = existingUser.isVerified
       Verified = setAdmin(isVerified)
    //   res.cookie("isVerified", Verified
    //   ,{
    //   httpOnly: true, 
    //   secure: true,
    //   sameSite: 'None',
    //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //   domain: 'microfinanc.netlify.app'
    //   }
    // )
    }
    res.status(200).json({
      message: "login successful",
      user: userData,
      token,
      Verified
    })
  } catch (error) {
    console.log(error, error.message, error.code)
    return res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
}

async function signup(req, res) {
  try {
    const { name, email, cnic, password, phone, address, city, country } =
      req.body;
    const data = { name, email, cnic, password, phone, address, city, country };
    const validatedData = userValidationSchema.parse(data)
    const validEmail = validatedData.email
    const validPassword = validatedData.password
    const validCnic = validatedData.cnic
    const existingUser = await User.findOne({
      $and: [{ email: validEmail }, { cnic: validCnic }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "account already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(validPassword, 10);
    const newUser = new User({ ...validatedData, password: hashedPassword })
    await newUser.save()
    await verifyEmail(newUser.email, otpGenrate)
    res
      .status(201)
      .json({ message: "user registered successfully", data: newUser._id, email: newUser.email  || "signup success" })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "account already exists change email or cnic",
      });
    }
    return res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
}

async function OTP(req, res) {
  try {
    const userId = req.params.id
    const { email , otp } = req.body
    console.log("gen",otpGenrate, "useremail", email)
    const otpDoc = await EmailOTP.findOne({ email, otp })
    console.log("otpDoc", otpDoc)
    if (!otpDoc) {
       return res.status(400).json({
       message: "invalid OTP",
       error: otpDoc.message,
    })
    }

    if (otpDoc.isUsed) {
       return res.status(400).json({
       message: "OTP already used",
       error: otpDoc.message,
    })
    }

    if (otpDoc.expiresAt < new Date()) {
       return res.status(400).json({
       message: "OTP has expired",
       error: otpDoc.message,
    })
    }

    otpDoc.isUsed = true
    await otpDoc.save()
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isVerified : true
      },
      { new: true }
    )
    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    console.log("update", updatedUser)
    // await EmailOTP.deleteMany({ email : userEmail })
    return res.status(200).json({
      message: "Approved",
      updateUser: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user:", error, error.message, error.code);
    return res.status(500).json({
      message: "something went wrong while OPT verification",
      error: error.message,
    })
  }
}

export { login, signup, OTP }
