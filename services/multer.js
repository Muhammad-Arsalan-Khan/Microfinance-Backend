import multer from "multer"

const storage = multer.memoryStorage()

const upload = multer({ storage })

export default upload

//**Note changes for vercel deployment


// import fs from "fs"
// import path from "path"
// const uploadDir = path.join("uploads")
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`)
//   },
// });
// const upload = multer({ storage: storage }) 
// export default upload
