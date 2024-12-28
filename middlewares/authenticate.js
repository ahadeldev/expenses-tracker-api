import jwt from "jsonwebtoken";
import tokensConfig from "../config/tokensConfig.js";
import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpStatusCodes.js";
import { checkLogoutToken } from "../utils/tokensUtils.js";

const authenticate = async (req, res, next) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  
  if(!accessToken){
    const error = new ApiError("not autherized, no token, please login", httpStatusCodes.FORBIDDEN);
    return next(error);
  }

  const loggedOutToken = await checkLogoutToken(accessToken);
  if(loggedOutToken){
    const error = new ApiError("old token, please login", httpStatusCodes.FORBIDDEN);
    return next(error);
  }

  try {
    const verifiedToken = jwt.verify(accessToken, tokensConfig.jwtConfig.secret);
    req.user = verifiedToken;
    next();
  } catch (err) {
    if(err.name === "TokenExpiredError"){
      const error = new ApiError("expired token, please login", httpStatusCodes.BAD_REQUSEST);
      return next(error);
    } else {
      const error = new ApiError("invalid token, please login", httpStatusCodes.BAD_REQUSEST);
      return next(error);
    }
  }
}

export default authenticate;