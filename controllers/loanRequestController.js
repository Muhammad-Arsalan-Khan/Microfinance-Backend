import LoanRequest from "../models/loanSchema.js"
import { loanValidationSchema } from "../validation/loanValidation.js"
import shortid from "shortid"
import { generateAppointment } from "../services/appointmentService.js"
import LoanCategory from "../models/loanCategorySchema.js"
import path from "path"
import { imgUplodefnx } from "../services/imgUplode.js"
import { dataToQrFnx } from "../services/qrURL.js"
import User from "../models/userSchema.js"
const tempDir = path.join("temp")


async function loanRequest(req, res) {
  const user = req.user.userId || req.params.id
  if (!user) {
    return res.status(400).json({ msg: "user id is required" })
  }
  try {
    let {
      userCnic,
      userEmail,
      userName,
      category,
      subCategory,
      requestedAmount,
      initialPayment,
      durationMonths,
      monthlyInstallment,
      guarantors,
      salarySlipURL,
      token,
      qrCodeURL,
      appointmentDate,
      appointmentLocation,
      appointmentTime,
    } = req.body;

    if (
      !category ||
      !subCategory ||
      !requestedAmount ||
      !initialPayment ||
      !durationMonths ||
      !guarantors ||
      !userCnic ||
      !userEmail ||
      !userName
    ) {
      return res.status(400).json({ msg: "all fields are required" })
    }

    const existingUser = await User.findOne({ _id: user })
    if (existingUser.loanId.length >= 3) {
      return res.status(400).json({
        msg: "applicants are not allowed to apply for more than three loans",
      })
    }

    const categoryData = await LoanCategory.findOne({ category })

    if (!categoryData) {
      return res.status(400).json({ msg: "invalid category" })
    }

    const { subcategory } = categoryData;
    const isValid = subcategory.some((item) => item === subCategory)
    if (!isValid) {
      return res.status(400).json({ msg: "invalid subcategory" })
    }

    const { maxAmount } = categoryData
    if (requestedAmount > maxAmount) {
      return res
        .status(400)
        .json({ msg: "Request amount exceeds max allowed amount" });
    }

    const { loanPeriod } = categoryData
    if (loanPeriod < durationMonths) {
      return res
        .status(400)
        .json({ msg: "loan period exceeds maximum allowed duration" })
    }

    const validationInitialPayment = 0.3 * requestedAmount
    if (initialPayment < validationInitialPayment) {
      return res.status(400).json({
        msg: "your initial payment must be at least 30% of the requested amount",
      });
    }
    if (!req.file) {
      return res.status(400).json({ msg: "image is required" })
    }

    monthlyInstallment = Number(
      Math.ceil((requestedAmount - initialPayment) / durationMonths)
    )

    token = shortid.generate()
    guarantors = JSON.parse(req.body.guarantors)
    const result = await generateAppointment()
    appointmentDate = result.appointment.date
    appointmentLocation = result.appointment.location
    appointmentTime = result.appointment.timeSlot

    const file = req.file;
    salarySlipURL = await imgUplodefnx(file, "image/") || "statement"

    const qrJson = {
      user,
      ...req.body,
      monthlyInstallment,
      guarantors,
      salarySlipURL,
      token,
      qrCodeURL,
      appointmentDate,
      appointmentLocation,
      appointmentTime,
    }

    qrCodeURL = await dataToQrFnx(tempDir, qrJson, token) || "qrCodeURL"

    const data = {
      ...qrJson,
      durationMonths: Number(durationMonths),
      requestedAmount: Number(requestedAmount),
      initialPayment: Number(initialPayment),
      qrCodeURL,
    }

    try {
      loanValidationSchema.parse(data)
    } catch (validationError) {
      console.log("zod validation errors:", validationError.errors)
      return res
        .status(400)
        .json({ msg: "validation failed", error: validationError.errors })
    }

    const loan = new LoanRequest(data)
    await loan.save()

    return res.status(201).json({ msg: "loan request successful", data: loan })
  } catch (error) {
    console.log(error, error.message, error.code)
    return res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
}

async function getLoandata(req, res){
   try {
    const user = req.user?.userId || req.params.id
    const response = await LoanRequest.find({user, loanStatus: { $in: ["Pending", "Approved"]}})
    return res.json({msg: "all loan application ", data : response})
  } catch (error) {
    console.error("Error getting loan application:", err, err.message, err.code)
    return res.status(500).json({
      message: "Something went wrong while getting the loan application",
      error: err.message,
    });
  }
}

export { loanRequest, getLoandata }
