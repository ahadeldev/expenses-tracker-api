import bcrypt from "bcryptjs";

/* 
  * Generate a hashed version of the user password for saving in database.
  * @param { string } password - The user plain text password.
  * @returns { string } - Returns the hashed version of the password as a string .
*/
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

/* 
  * Comparing both the user password submitted while logging in and the user password stored in the database.
  * @param { string } password - The user plain text password.
  * @param { string } dbPassword - The user hashed password from the database.
  * @returns { boolean } - Returns true if the passwords match, false otherwise.
*/
export const checkPassword = async (password, dbPassword) => {
  const isPassword = await bcrypt.compare(password, dbPassword);
  return isPassword;
}