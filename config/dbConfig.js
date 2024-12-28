import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import migrationConfig from "./migrationConfig.js"

dotenv.config();

export const sequelize = new Sequelize(
  migrationConfig.production.database,
  migrationConfig.production.username,
  migrationConfig.production.password,
  {
    host: migrationConfig.production.host,
    port: 5432,
    dialect: migrationConfig.production.dialect,
    logging: false
  }
)

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("==> Database connection successfully established.");
  } catch (error) {
    console.log("==> Error connecting to database.")
  }
}