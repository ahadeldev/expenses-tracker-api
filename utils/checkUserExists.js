import { Op } from "sequelize";
import User from "../models/userModel.js";

/* 
  * Check if a username or email already exists in the database.
  * @param { string } email - The email to check.
  * @param { string } username - The username to check.
  * @returns { boolean } - Returns true if a match is found, false otherwise.
*/

const checkUserExists = async (email, username) => {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        {email: email},
        {username: username}
      ]
    }
  });
  return existingUser;
}

export default checkUserExists