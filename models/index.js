const mongoose = require("mongoose");

// Import all models
const User = require("./User");
const Expense = require("./Expense");
const Income = require("./Income");
const Note = require("./Note");
const ForgotPasswordRequest = require("./ForgotPasswordRequest");

// Export models
module.exports = {
  mongoose,
  User,
  Expense,
  Income,
  Note,
  ForgotPasswordRequest
};