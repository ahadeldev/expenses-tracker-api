import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/dbConfig.js";
import { verifyEmailService } from "./utils/mailUtils.js";
import logger from "./middlewares/logger.js";
import appErrorHandler from "./middlewares/appErrorHandler.js";
import routeNotFound from "./middlewares/routeNotFound.js";
import globalRateLimiter from "./middlewares/globalrateLimiter.js";

import authRoutes from "./features/auth/authRoutes.js";
import usersRoutes from "./features/users/usersRoutes.js";
import expenseRoutes from "./features/expenses/expensesRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8001;

const startApp = async () => {
  app.use(globalRateLimiter); // Apply the rate limiter globally to all routes
  app.use(express.urlencoded({extended: false})); // Parse url encoded data.
  app.use(logger); // Custom logger middleware.
  app.use(cookieParser()); // Cookie parsing middleware.

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", usersRoutes);
  app.use("/api/v1/expenses", expenseRoutes);

  app.use(routeNotFound); // Middleware to handle not found routes. 
  app.use(appErrorHandler); // Globl app error handling middleware.

  await connectDB(); // Test database connection.
  verifyEmailService(); // Verify mail service.
  app.listen(PORT, ()=>{
    console.log(`==> Server started on port: ${PORT}`);
  })
}

startApp();