import cloudinary from "./cloudinary.js"
import qr from "qrcode"

export async function dataToQrFnx(qrJson, token) {
  const qrBase64 = await qr.toDataURL(JSON.stringify(qrJson))
  try {
    const uploadRes = await cloudinary.uploader.upload(qrBase64, {
      folder: "loan-qrcodes",
      public_id: `qr-${token}`,
    })

    return uploadRes.secure_url
  } catch (uploadErr) {
    throw new Error("QR code upload failed: " + uploadErr.message)
  }
}

//**Note changes for vercel deployment

// import fs from "fs"
// import path from "path"
// export async function dataToQrFnx(tempDir, qrJson, token, ) {
//   if (!fs.existsSync(tempDir)) {
//     fs.mkdirSync(tempDir)
//   }
//   const qrBase64 = await qr.toDataURL(JSON.stringify(qrJson))
//   const base64Data = qrBase64.replace(/^data:image\/png;base64,/, "")
//   const tempFilePath = path.join("temp", `qr-${token}.png`)
//   fs.writeFileSync(tempFilePath, base64Data, "base64")
//   let qrUploadRes
//   try {
//     qrUploadRes = await cloudinary.uploader.upload(tempFilePath, {
//       folder: "loan-qrcodes",
//       public_id: `qr-${token}`,
//     });
//     fs.unlinkSync(tempFilePath)
//     return qrUploadRes.secure_url
//   } catch (uploadErr) {
//     fs.unlinkSync(tempFilePath)
//     return res.status(500).json({
//       msg: "QR code upload failed",
//       error: uploadErr.message,
//     })
//   }
// }