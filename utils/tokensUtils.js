import crypto from "crypto";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshTokenModel.js";
import LogoutToken from "../models/logOutToken.js";
import tokensConfig from "../config/tokensConfig.js";
import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpStatusCodes.js";

/* 
  * Generating new refresh token using crypto.
  * @param { string } userId - The user id to save it with token record.
  * @returns { refresh_token sequelize model instance } - Returns a result object of the saved data.
*/
export const generateRefreshToken = async (userId) => {
  // CHeck if user already has a valid refresh token.
  const activeTokenFound = await RefreshToken.findOne({ where: { userId: userId, revoked: false } });
  if(activeTokenFound){
    return activeTokenFound;
  }

  // If the user has no refresh tokens, Generate new one and save to the database.
  const token = crypto.randomBytes(tokensConfig.refTokenConfig.length).toString('hex');
  const expiration = Date.now() + (tokensConfig.refTokenConfig.expiration * 60 * 60 * 1000);
  const savedToken = await RefreshToken.create({
    token: token,
    userId,
    expiresAt: expiration
  });
  if(!savedToken){
    throw new ApiError("error generating refresh token", httpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return savedToken;
}

/* 
  * Generating new JWT token.
  * @param { database object } user - The user id to save it with token record.
  * @returns { jwt string } - Returns a json web token string.
*/
export const generateAccessToken = (user) => {
  const payload = {
    id: user.userId,
    email: user.email,
    sub: tokensConfig.jwtConfig.subject,
    iss: tokensConfig.jwtConfig.issuer,
    aud: tokensConfig.jwtConfig.audience,
  };

  const token = jwt.sign(
    payload,
    tokensConfig.jwtConfig.secret, {
      expiresIn: tokensConfig.jwtConfig.expiresIn,
      algorithm: tokensConfig.jwtConfig.algorithm,
    }
  )
  if(!token){
    throw new ApiError("error generating token", httpStatusCodes.INTERNAL_SERVER_ERROR);
  }
  
  return token;
}

/* 
  * Check if the user has a refresh token and validate it.
  * @param { string } userId - The user id to save it with token record.
  * @returns { object } - Returns an object with the refresh token details.
*/
export const checkRefreshToken = async (userId) => {
  const token = await RefreshToken.findOne({
    where: {
      userId: userId,
      revoked: false
    }
  });

  const now = new Date();

  // Check if the found token is valid
  if(token && new Date(token.expiresAt) > now){
    return { isNewToken: false, token: token};
  }

  // If the found token invalid, generate new one
  const newToken = await generateRefreshToken(userId);

  // Make sure if there are any tokens revoke them
  if(token){
    token.revoked = true;
    await token.save();
  }

  return { isNewToken: true, token: newToken };

}

/* 
  * Check if token is in the logout_tokens, old-invalidated token.
  * @param { string } accessToken - The user JWT token string.
  * @returns { object } - Returns an object with the jwt token details if exists, null if it is't.
*/
export const checkLogoutToken = async (accessToken) => {
  const token = await LogoutToken.findOne({
    where: {token: accessToken}
  });
  return token;
}