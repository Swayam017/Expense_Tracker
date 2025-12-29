const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db_connections");

const User = sequelize.define("User", {
  username: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  totalSpent: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0
  }
});

module.exports = User;
