import crypto from "crypto";
import User from "../../models/userModel.js";
import LogoutToken from "../../models/logOutToken.js";
import RefreshToken from "../../models/refreshTokenModel.js";
import Otp from "../../models/otpModel.js";
import ApiError from "../../shared/apiError.js";
import httpStatusCodes from "../../shared/httpStatusCodes.js";
import { hashPassword, checkPassword } from "../../utils/passwordUtils.js";
import { generateAccessToken, checkRefreshToken } from "../../utils/tokensUtils.js";
import { sendMail } from "../../utils/mailUtils.js";
import checkUserExists from "../../utils/checkUserExists.js";

class AuthServices {

  // Register user handler
  static async registerUser(name, email, username, password){
    // Check if email or username elready exits
    const user = await checkUserExists(email, username);
    if(user){
      throw new ApiError("email or username already in use", httpStatusCodes.UNPROCESSABLE_ENTITY);
    }
    
    // Hashing the passord 
    const hashedPassword = await hashPassword(password);
    // Saving user data in the database
    const newUser = await User.create({name, email, username, password: hashedPassword});
    if(!newUser){
      throw new ApiError("error registering user, please try again", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    
    return newUser;
  }

  // Login user handler
  static async loginUser(username, password){
    
    // Check if the username exists
    const userExists = await checkUserExists(null, username);
    if(!userExists){
      throw new ApiError("wrong username", httpStatusCodes.BAD_REQUSEST);
    }

    // Check if the password correct
    const correctPassword = await checkPassword(password, userExists.password);
    if(!correctPassword){
      throw new ApiError("wrong password", httpStatusCodes.BAD_REQUSEST);
    }

    // Generate refresh token
    const { token } = await checkRefreshToken(userExists.userId);

    // Generate JWT access token
    const accessToken =  generateAccessToken(userExists);

    return { userExists, refreshToken: token.tokenId, accessToken };
  }

  // Logout user handler
  static async logoutUser(accessToken, refTokenId){
    const invalidAccessToken = await LogoutToken.create({token: accessToken});
    if(!invalidAccessToken){
      throw new ApiError("error invalidating access token, please try again", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    const [updatedCount] = await RefreshToken.update(
      { revoked: true },
      { where: { tokenId: refTokenId } }
    );
    if(updatedCount === 0) {
      throw new ApiError("no matching refresh token found to revoke", httpStatusCodes.NOT_FOUND);
    }

    return true;
  }

  // Refresh token handler
  static async generateNewAccessToken(refreshTokenId){
    const tokenRecord = await RefreshToken.findByPk(refreshTokenId);
  
    const now = new Date();
    if (tokenRecord.revoked || new Date(tokenRecord.expiresAt) < now) {
      return next(new ApiError("invalid or expired refresh token, please login", httpStatusCodes.FORBIDDEN));
    }

    const user = await User.findByPk(tokenRecord.userId);
    const newAccessToken = generateAccessToken(user);
    
    // Delete the user old-revoked refresh tokens
    await RefreshToken.destroy({ where: {
      userId: tokenRecord.userId,
      revoked: true
    }});
    return newAccessToken;
  }

  // Request password reset OTP handler
  static async getOtpViaEmail(reciever, userId){
    // Generate an OTP with length of 8 chars long and ensure it
    const otp = crypto.randomBytes(8).toString("hex").slice(0, 8);
    const otpMail = await sendMail(reciever, otp.toUpperCase());
    
    if(!otpMail){
      throw new ApiError("error sending otp mail", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    // Save OTP in database
    const savedOtp = await Otp.create({
      otp: otp.toUpperCase(),
      userId: userId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration date
    });

    if(!savedOtp){
      throw new ApiError("error saving otp record", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return {sentEmail: savedOtp};
  }

  // Password reset and otp confirm handler
  static async resetPassword(userId, otp, newPassword){
    const getSavedOtp = await Otp.findOne({where: { userId, otp }});
    if(!getSavedOtp || getSavedOtp.used === true){
      throw new ApiError("invalid OTP code", httpStatusCodes.BAD_REQUSEST);
    }

    // hash the new password
    const newHashedPassword = await hashPassword(newPassword);

    // Update user password
    const [updatedCount] = await User.update(
      {password: newHashedPassword},
      {where: { userId: userId}}  
    );
    
    if(updatedCount === 0){
      throw new ApiError("error updating user password", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    getSavedOtp.used = true;
    const updateOtpStatus = await getSavedOtp.save();
    if(!updateOtpStatus){
      throw new ApiError("error updating OTP status", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return true;
  }
}

export default AuthServices;