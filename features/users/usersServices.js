import User from "../../models/userModel.js";
import RefreshToken from "../../models/refreshTokenModel.js";
import LogoutToken from "../../models/logOutToken.js";
import ApiError from "../../shared/apiError.js";
import httpStatusCodes from "../../shared/httpStatusCodes.js";

class UsersServices {

  // Get user profile handler
  static async getUserProfile(userId){
    const user = await User.findByPk(userId);
    if(!user){
      throw new ApiError("user not found", httpStatusCodes.NOT_FOUND);
    }
    return user;
  }

  // Update user profile details handler
  static async updateUserProfile(userId, newName, newEmail, newUsername){
    const user = await User.findByPk(userId);
    if(!user){
      throw new ApiError("user not found", httpStatusCodes.NOT_FOUND);
    }

    // Assigning the user new details
    user.name = newName || user.name;
    user.email = newEmail || user.email;
    user.username = newUsername || user.username;

    // Saving user's new details
    const updatedUser = await user.save();
    if(!updatedUser){
      throw new ApiError("error updating user detals", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedUser;
  }

  // Delete user profile handler
  static async deleteUserProfile(userId){
    // Deleting user refresh tokens
    const refreshTokens = await RefreshToken.destroy({ where: { userId: userId } });
    if(!refreshTokens){
      throw new ApiError("error deleting user refresh tokens", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    
    // Deleting user account
    const deletedUser = await User.destroy({ where: { userId: userId } });
    if(!deletedUser){
      throw new ApiError("error deleting user", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return deletedUser;
  }

  // User profile uploader handler
  static async uploadProfileImage(userId, imagePath){
    // Adding the profile picture path to the users tabel. 
    const user = await User.findByPk(userId);
    user.profileImagePath = imagePath;
    await user.save();
    return true
  }
}

export default UsersServices;