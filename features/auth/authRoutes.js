import express from "express";
import AuthControllers from "./authControllers.js";
import authenticate from "../../middlewares/authenticate.js";
import refreshTokenMiddleware from "../../middlewares/refreshTokenMiddleware.js";

const router = express.Router();

// Register user route
router.post("/register", AuthControllers.registerUserController);

// Login user route
router.post("/login", AuthControllers.loginUserController);

// Logout user route
router.post("/logout", authenticate, AuthControllers.logoutUserController);

// refresh access token route
router.post("/refresh", refreshTokenMiddleware, AuthControllers.refreshAccessTokenController);

// request OTP for password reset
router.post("/pwd-reset/request", authenticate, AuthControllers.requestOtpController);

// confirm OTP and reset password
router.post("/pwd-reset/confirm", authenticate, AuthControllers.resetPasswordController);
export default router;