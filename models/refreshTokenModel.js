import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const RefreshToken = sequelize.define("RefreshToken", {
  tokenId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.literal("gen_random_uuid()")
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "userId",
    }
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn("NOW"),
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  tableName: "refresh_tokens",
  timestamps: false
});

RefreshToken.associate = (models) => {
  RefreshToken.belongsTo(models.User, {foreignKey: "userId", as: "user"});
};

export default RefreshToken;