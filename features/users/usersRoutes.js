import express from "express";
import UsersControllers from "./usersControllers.js";
import authenticate from "../../middlewares/authenticate.js";
import imageUploader from "../../middlewares/imageUploader.js";

const router = express.Router();

// User profile details route
router.get("/profile", authenticate, UsersControllers.getUserProfileController);

// User profile update route
router.put("/profile", authenticate, UsersControllers.updateUserDetailsController);

// User profile delete route
router.delete("/profile", authenticate, UsersControllers.deleteUserProfileController);

// User profile picture upload route
router.post("/profile/pic", authenticate, imageUploader.single("profilePicture"), UsersControllers.profileImageUploaderController);

export default router;