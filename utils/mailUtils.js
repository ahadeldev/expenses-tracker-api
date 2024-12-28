import nodemailer from "nodemailer";
import mailConfig from "../config/mailConfig.js";

const transporter = nodemailer.createTransport({
  service: mailConfig.service,
  auth: {
    user: mailConfig.emailString,
    pass: mailConfig.emailPassword
  }
});

/* 
  * Verify that the email service is active.
  * @param No Params.
  * @returns { Boolean } - Returns true in case of success, false otherwise.
*/
export const verifyEmailService = () => {
  transporter.verify((error, success) => {
    if (error) {
      console.log(`==> Error verifing mail service: ${error}`);
    }

    if (success) {
      console.log(`==> Mail service is ready`);
    }
  })
}

/* 
  * function that handles email sending
  * @param { string } reciever - The mail address that recieves the email.
  * @param { string } otp - A 6 characters long otp.
  * @returns { Boolean } - returns true in case of email sent, false othrwise.
*/
export const sendMail = async (reciever, otp) => {
  const mailOptions = {
    from: mailConfig.emailString,
    to: reciever,
    subject: 'Expense Tracker: Your Password Reset OTP Code',
    html: `<p>Your OTP is: <b>${otp}</b></p>`
  };

  const sentmail = await transporter.sendMail(mailOptions);
  
  if(!sentmail){
    return { emailSent: false };
  }

  return { emailSent: true };
}