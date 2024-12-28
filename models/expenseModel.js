import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Expense = sequelize.define("Expense", {
  expneseId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.literal("gen_random_uuid()")
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "userId"
    }
  }
}, {
  tableName: "expenses",
  timestamps: true
});

Expense.associate = (models) => {
  Expense.belongsTo(models.User, { foreignKey: "userId", as: "user" });
};

export default Expense;