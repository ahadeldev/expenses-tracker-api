import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const LogoutToken = sequelize.define("LogoutToken", {
  tokenId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.literal("gen_random_uuid()")
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  tableName: "logout_tokens",
  timestamps: false
});

export default LogoutToken;