import fs from "fs";
//import path from "path";
import cloudinary from "./cloudinary.js";
// import LoanRequest from "../models/loanSchema.js";

export async function imgUplodefnx(file, fileName) {
  if (!file.mimetype.startsWith(fileName)) {
    return res.status(400).json({ msg: "Only image files are allowed!" });
  }
  if (file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ msg: "Image size must be less than 5MB" });
  }

  let statementFilePath;
  try {
    const cloudinaryRes = await cloudinary.uploader.upload(file.path);
    statementFilePath = file.path;
    fs.unlinkSync(statementFilePath);
    return  cloudinaryRes.secure_url;
  } catch (cloudinaryError) {
    fs.unlinkSync(statementFilePath);
    return res.status(500).json({
      msg: "Failed to upload image to Cloudinary",
      error: cloudinaryError.message,
    });
  }
}
