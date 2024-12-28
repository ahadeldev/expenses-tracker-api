import ApiError from "../shared/apiError.js";
import httpStatusCodes from "../shared/httpStatusCodes.js";

/* 
  * function that handles returning error objects to th global error handler
  * @param { Error Object } err - Error object.
  * @param { NextFunction } next - functions that hand over the error to the next middleware in the stack.
  * @returns { Custom Error Object } - returns a custom ereor object.
*/
const returnError = (err, next) => {
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

export default returnError;