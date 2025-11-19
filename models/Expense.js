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
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {            
            type: DataTypes.INTEGER,
            allowNull: false
        }

});

module.exports = Expense;
