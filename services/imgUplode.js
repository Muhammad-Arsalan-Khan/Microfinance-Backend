import cloudinary from "./cloudinary.js"

export async function imgUplodefnx(file, fileName) {
  if (!file.mimetype.startsWith(fileName)) return res.status(400).json({ msg: "only image files are allowed" })

  if (file.size > 5 * 1024 * 1024) return res.status(400).json({ msg: "image size must be less than 5MB" })

  const fileBuffer = file?.buffer
  try {
    const response = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
      stream.end(fileBuffer)
    })
    return response.secure_url
  } catch (cloudinaryError) {
     return res.status(500).json({
      msg: "failed to upload image to cloudinary",
      error: cloudinaryError.message,
    })
  }
}

//**Note changes for vercel deployment
// import fs from "fs"
// let statementFilePath
  // try {
  //   const cloudinaryRes = await cloudinary.uploader.upload(file.path)
  //   statementFilePath = file.path
  //   fs.unlinkSync(statementFilePath)
  //   return  cloudinaryRes.secure_url
  // } catch (cloudinaryError) {
  //   fs.unlinkSync(statementFilePath)
  //   return res.status(500).json({
  //     msg: "failed to upload image to cloudinary",
  //     error: cloudinaryError.message,
  //   });
  // }
