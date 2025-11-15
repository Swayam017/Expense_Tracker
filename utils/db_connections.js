const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("expensedb", "root", "Mitaliguli017#", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
