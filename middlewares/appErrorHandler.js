import httpStatusCodes from "../shared/httpStatusCodes.js";
import ApiError from "../shared/apiError.js";

const appErrorhandler = (err, req, res, next) => {

  if (err instanceof ApiError) {
    return err.send(res); // Send standardized error response
  }

  // Generic error handler for unhandled errors
  const apiError = new ApiError(
    err.message || "Internal Server Error", 
    err.status || httpStatusCodes.INTERNAL_SERVER_ERROR,
    err.details || null
  );
  return apiError.send(res);
}

export default appErrorhandler;