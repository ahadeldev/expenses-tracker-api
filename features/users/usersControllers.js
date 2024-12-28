import httpStatusCodes from "../../shared/httpStatusCodes.js";
import ApiError from "../../shared/apiError.js";
import ApiResponse from "../../shared/apiResponse.js";
import UsersServices from "./usersServices.js";
import returnError from "../../utils/returnError.js";

class UsersControllers {

  // @desc    Get user profile
  // @route   GET /api/v1/users/profile
  // @access  Private
  static async getUserProfileController(req, res, next){
    const userId = req.user.id;
    try {
      const data = await UsersServices.getUserProfile(userId);
      const userProfile = {
        id: data.userId,
        name: data.name,
        email: data.email,
        username: data.username,
      };
      const response = new ApiResponse(httpStatusCodes.OK, "USER PROFILE", userProfile);
      response.send(res);
    } catch (err) {
      returnError(err, next);
    }
  }

  // @desc    Update user profile details
  // @route   PUT /api/v1/users/profile
  // @access  Private
  static async updateUserDetailsController(req, res, next){
    const userId = req.user.id;
    const { newName, newEmail, newUsername } = req.body;
    try {
      const updatedProfile = await UsersServices.updateUserProfile(userId, newName, newEmail, newUsername);
      const response = new ApiResponse(httpStatusCodes.OK, "USER DETAILS UPDATED", updatedProfile);
      response.send(res);
    } catch (err) {
      returnError(err, next);
    }
  }

  // @desc    Delete user profile
  // @route   DELETE /api/v1/users/profile
  // @access  Private
  static async deleteUserProfileController(req, res, next){
    const userId = req.user.id;
    try {
      const deletedProfile = await UsersServices.deleteUserProfile(userId);
      const response = new ApiResponse(httpStatusCodes.OK, "USER PROFILE DELETED", deletedProfile);
      response.send(res);
    } catch (err) {
      returnError(err, next);
    }
  }

  // @desc    Upload user profile image
  // @route   POST /api/v1/users/profile/pic
  // @access  Private
  static async profileImageUploaderController(req, res, next){
    const userId = req.user.id;
    const image = req.file;
    try {
      const savedImage = await UsersServices.uploadProfileImage(userId, image.path);
      const response = new ApiResponse(httpStatusCodes.OK, "IMAGE UPLOADED", savedImage);
      response.send(res);
    } catch (err) {
      returnError(err, next);
    }
  }
}

export default UsersControllers;