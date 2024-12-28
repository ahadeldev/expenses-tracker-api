import ApiError from "../../shared/apiError.js";
import ApiResponse from "../../shared/apiResponse.js";
import httpStatusCodes from "../../shared/httpStatusCodes.js";
import AuthServices from "./authServices.js";

class AuthControllers {

  // @desc    Register user
  // @route   POST /api/v1/auth/register
  // @access  Public
  static async registerUserController(req, res, next){
    const {name, email, username, password} = req.body;
    if(!name || !email || !username || !password){
      return next(new ApiError("please fill all fields", httpStatusCodes.UNPROCESSABLE_ENTITY));
    }

    if(password.length < 6){
      return next(new ApiError("password mut be 6 characters long", httpStatusCodes.BAD_REQUSEST));
    }

    try {
      const user = await AuthServices.registerUser(name, email, username, password);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "USER REGISTERD SUCCESSFULLY", user);
      response.send(res);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      } else {
        const generalError = new ApiError(
          err.message || "an unexpected error occurred",
          err.status || httpStatusCodes.INTERNAL_SERVER_ERROR,
          err.details || null
        );
        return next(generalError);
      }
    }
  }

  // @desc    Login user
  // @route   POST /api/v1/auth/login
  // @access  Public
  static async loginUserController(req, res, next){
    const {username, password} = req.body;
    if(!username || !password){
      return next(new ApiError("please fill all fields (username, password)", httpStatusCodes.BAD_REQUSEST));
    }

    try {
      const loggedInUser = await AuthServices.loginUser(username, password);

      const userData = {
        id: loggedInUser.userExists.userId,
        name: loggedInUser.userExists.name,
        email: loggedInUser.userExists.email,
        username: loggedInUser.userExists.username,
        refreshToken: loggedInUser.refreshToken,
        accessToken: loggedInUser.accessToken
      };

      res.cookie(
        "refreshToken",
        loggedInUser.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 60 * 60 * 1000
        }
      )
      
      const response = new ApiResponse(httpStatusCodes.OK, "LOGGIN SUCCESSFULLY", userData);
      response.send(res);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      } else {
        const generalError = new ApiError(
          err.message || "an unexpected error occurred",
          err.status || httpStatusCodes.INTERNAL_SERVER_ERROR,
          err.details || null
        );
        return next(generalError);
      }
    }
  }

  // @desc    Logout user
  // @route   POST /api/v1/auth/logout
  // @access  Private
  static async logoutUserController(req, res, next){
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;
    try {
      const loggedOut = await AuthServices.logoutUser(accessToken, refreshToken);
      const response = new ApiResponse(httpStatusCodes.OK, "LOGOUT SUCCESSFULLY", {status: loggedOut});
      response.send(res);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      } else {
        const generalError = new ApiError(
          err.message || "an unexpected error occurred",
          err.status || httpStatusCodes.INTERNAL_SERVER_ERROR,
          err.details || null
        );
        return next(generalError);
      }
    }
  }

  // @desc    Refresh access token
  // @route   POST /api/v1/auth/refresh
  // @access  Private
  static async refreshAccessTokenController(req, res, next){
    const refreshTokenId = req.refreshToken;
    try {
      const newAccessToken = await AuthServices.generateNewAccessToken(refreshTokenId);
      const response = new ApiResponse(httpStatusCodes.OK, "NEW ACCESS TOKEN", newAccessToken);
      response.send(res);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      } else {
        const generalError = new ApiError(
          err.message || "an unexpected error occurred",
          err.status || httpStatusCodes.INTERNAL_SERVER_ERROR,
          err.details || null
        );
        return next(generalError);
      }
    }
  }

  // @desc    Request an OTP for password reset
  // @route   POST /api/v1/auth//pwd-reset/request
  // @access  Private
  static async requestOtpController(req, res, next){
    const userId = req.user.id;
    const reciever = req.body.reciever;
    try {
      const sendOtp = await AuthServices.getOtpViaEmail(reciever, userId);
      const response = new ApiResponse(httpStatusCodes.OK, "OTP EMAIL SENT SUCCESSFULLY", sendOtp);
      response.send(res);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      } else {
        const generalError = new ApiError(
          err.message || "an unexpected error occurred",
          err.status || httpStatusCodes.INTERNAL_SERVER_ERROR,
          err.details || null
        );
        return next(generalError);
      }
    }
  }

  // @desc    Confirm the password OTP and reset password
  // @route   POST /api/v1/auth//pwd-reset/confirm
  // @access  Private
  static async resetPasswordController(req, res, next){
    const userId = req.user.id;
    const { otp, newPassword} = req.body;
    try {
      const pwdReset = await AuthServices.resetPassword(userId, otp, newPassword);
      const response = new ApiResponse(httpStatusCodes.OK, "PASSWORD RESET SUCCESSFULLY", pwdReset);
      response.send(res);
    } catch (err) {
      if(err instanceof ApiError){
        return next(err);
      } else {
        const generalError = new ApiError(
          err.message || "an unexpected error occurred",
          err.status || httpStatusCodes.INTERNAL_SERVER_ERROR,
          err.details || null
        );
        return next(generalError);
      }
    }
  }
}

export default AuthControllers;