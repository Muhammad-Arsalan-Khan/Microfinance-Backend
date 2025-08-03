import User from "../models/userSchema.js"
import { userValidationSchema } from "../validation/userValidation.js"
import bcrypt from "bcryptjs"
import { setUser, setAdmin } from "../utils/jwt.js"
import { verifyEmail } from "../nodemailer/nodemailer.js"
import { create } from "qrcode"

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
      verifyEmail(existingUser.email, otpGenrate)
      return res.status(401).json({
        message: "unAuthorized user",
        data: existingUser._id,
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
    await newUser.save();
    verifyEmail(newUser.email, otpGenrate)
    res
      .status(201)
      .json({ message: "user registered successfully", data: newUser._id || "signup success" })
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
  const userId = req.params.id
  console.log("userId:", userId)
  try {
    const { isVerified, otpValue } = req.body;
    console.log("genrated:", otpGenrate, "otpValue:", otpValue);
    const OtpValue = Number(otpValue);
    if (OtpValue !== otpGenrate) {
      return res.status(401).json({ message: "wrong OTP" });
    }
    if (!userId) {
      return res.status(400).json({ message: "user id is required" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isVerified,
      },
      { new: true }
    )
    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    console.log("user update successfully", updatedUser);
    otpGenrate = null;
    return res.status(200).json({
      message: "Approved",
      updateUser: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error, error.message, error.code);
    return res.status(500).json({
      message: "something went wrong while OPT verification",
      error: error.message,
    });
  }
}

export { login, signup, OTP }
