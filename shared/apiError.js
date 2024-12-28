import dotenv from "dotenv";
dotenv.config();

class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.status = status;
    this.details = details;
    this.stack = process.env.NODE_ENV === 'development' ? this.stack : undefined; // Only in dev
  }

  // To format error response in a standard way
  send(res) {
    return res.status(this.status).json({
      status: this.status,
      message: this.message,
      details: this.details,
      stack: this.stack, // Include stack trace only in development
    });
  }
}

export default ApiError;