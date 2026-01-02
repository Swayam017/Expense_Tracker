const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db_connections");

const Income = sequelize.define("Income", {
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
    UserId: {                       
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Income;
