const Sequelize = require("sequelize");
const db = require("../utils/db_connections");

// Import models
const User = require("./User");
const Expense = require("./Expense");
const Income = require("./Income");
const Note = require("./Note");
// Associations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Income);
Income.belongsTo(User);

User.hasMany(Note, { onDelete: "CASCADE" });
Note.belongsTo(User);


module.exports = {
  User,
  Expense,
  Income,
  Note,
  db
};
