import dotenv from "dotenv";

dotenv.config();
const tokensConfig = {
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    algorithm: "HS256", // HMAC using SHA-256 (Defalut algorithm)
    expiresIn: "5m", // Expiry time for the token
    issuer: "expnsesTrackerApp", // Issuer of the token
    audience: "expnsesTrackerAppUsers", // Intended audience for the token
    subject: "userId", // The subject of the token (userId)
  },
  refTokenConfig: {
    length: 64,
    expiration: 7
  }
};

export default tokensConfig