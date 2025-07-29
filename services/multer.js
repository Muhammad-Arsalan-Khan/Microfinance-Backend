import multer from 'multer'
import fs from "fs"
import path from "path"

const uploadDir = path.join("uploads")

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
});

const upload = multer({ storage: storage }) 

export default upload
