import multer from "multer";
import { storage } from "../config/imageUploadConfig.js";
import { fileFilter } from "../config/imageUploadConfig.js";

const imageUploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024}, //  // Limits the image file size to 2MB.
})

export default imageUploader;