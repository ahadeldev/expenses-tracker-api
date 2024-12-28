import dotenv from "dotenv";

dotenv.config();
const mailConfig = {
  service: "gmail",
  emailString: process.env.MAIL_USER,
  emailPassword: process.env.MAIL_PASS
};

export default mailConfig;