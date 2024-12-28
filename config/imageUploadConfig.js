import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from "multer";
import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpStatusCodes.js";

// Get the correct __dirname for ES6 module, it is not available by default as in commonjs.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id;
    const userFolder = path.join(__dirname, "../uploads", `user${userId}`, "profile-pics");

    // Ensure the directory exists
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }
    
    // Set the error to null and the 
    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    const userId = req.user.id;
    const userFolder = path.join(__dirname, "../uploads", `user${userId}`, "profile-pics");
    // Check if a file already exists in the folder and delete it.
    fs.readdir(userFolder, (err, files) => {
      if(err) return cb(err);

      // Delete the old image if it exists
      files.forEach(file => {
      const filepath = path.join(userFolder, file);
      fs.unlinkSync(filepath); // Delete the old image file
      })
    })

     // Save the file with a unique name
     const uinqueFileName = `profile-${Date.now()}${path.extname(file.originalname)}`
     
     // Set the error to null and the 
     cb(null, uinqueFileName)
  }
});

export const fileFilter = (req, file, cb) => {
  const imagesFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if(imagesFileTypes.includes(file.mimetype)){
    // Set the error to null and return true as the file uploaded is supported
    cb(null, true);
  } else {
    // Set the error to an ApiError in case the user uploaded unsupported file type
    const err = new ApiError("invalid file type, only JPEG, PNG, and GIF are allowed", httpStatusCodes.UNSUPPORTED_MEDIA_TYPE, true);
    cb(err);
  }
}