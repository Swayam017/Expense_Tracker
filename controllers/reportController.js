const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { Op } = require("sequelize");

exports.getReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.findAll({
      where: { UserId: userId },
      order: [["date", "ASC"]],
    });

    const incomes = await Income.findAll({
      where: { UserId: userId },
      order: [["date", "ASC"]],
    });

    res.json({
      success: true,
      expenses,
      incomes
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load report" });
  }
};
