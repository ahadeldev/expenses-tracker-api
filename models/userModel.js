import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.literal("gen_random_uuid()")
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profileImagePath: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "users",
  timestamps: true
});

User.associate = (models) => {
  User.hasMany(models.Expense, {foreignKey: "userId"});
  User.hasMany(models.RefreshToken, {foreignKey: "userId"});
};

export default User;