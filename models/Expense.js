const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db_connections");

const Expense = sequelize.define("Expense", {
    description: {
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
    }
});

module.exports = Expense;
