const Expense = require("../models/Expense");
const Income = require("../models/Income");

/**
 * =======================
 * GET REPORT
 * =======================
 */
exports.getReport = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch expenses
    const expenses = await Expense.find({ user: userId })
      .sort({ date: 1 }); // ASC

    // Fetch incomes
    const incomes = await Income.find({ user: userId })
      .sort({ date: 1 }); // ASC

    res.json({
      success: true,
      expenses,
      incomes
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load report",
      error: err.message
    });
  }
};