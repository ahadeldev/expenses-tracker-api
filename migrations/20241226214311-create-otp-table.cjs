'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("otps", {
      otpId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal("gen_random_uuid()")
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "userId"
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    },)
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('otps');
     
  }
};
