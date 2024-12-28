import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpStatusCodes.js";

const refreshTokenMiddleware = async (req, res, next) => {
  const refresTokenId = req.cookies.refreshToken;
  if(!refresTokenId){
    return next(new ApiError("no refresh token found", httpStatusCodes.FORBIDDEN));
  }

  req.refreshToken = refresTokenId;
  next();
  
}

export default refreshTokenMiddleware