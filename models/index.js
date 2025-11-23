const Sequelize = require("sequelize");
const db = require("../utils/db_connections");

// Import models
const User = require("./User");
const Expense = require("./Expense");

// Associations
User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = {
  User,
  Expense,
  db
};
