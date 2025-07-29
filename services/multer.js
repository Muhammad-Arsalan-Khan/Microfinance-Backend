import multer from 'multer';
import fs from "fs";
import path from "path";


const uploadDir = path.join("uploads");

// Check if folder exists, if not then create
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Temporarily store image in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to prevent filename conflicts
  },
});

const upload = multer({ storage: storage }) // 'image' is the field name for image

export default upload;
