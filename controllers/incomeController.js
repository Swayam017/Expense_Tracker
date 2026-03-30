const Income = require("../models/Income");

/**
 * =======================
 * CREATE INCOME
 * =======================
 */
exports.createIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    const { source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const income = await Income.create({
      source,
      amount,
      date,
      user: userId
    });

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/**
 * =======================
 * GET ALL INCOME
 * =======================
 */
exports.getIncome = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      incomes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/**
 * =======================
 * UPDATE INCOME
 * =======================
 */
exports.updateIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    const incomeId = req.params.id;

    const { source, amount, date } = req.body;

    const income = await Income.findOne({
      _id: incomeId,
      user: userId
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found"
      });
    }

    // Update only if values provided
    if (source !== undefined) income.source = source;
    if (amount !== undefined) income.amount = amount;
    if (date !== undefined) income.date = date;

    await income.save();

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      income
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/**
 * =======================
 * DELETE INCOME
 * =======================
 */
exports.deleteIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    const incomeId = req.params.id;

    const income = await Income.findOne({
      _id: incomeId,
      user: userId
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found"
      });
    }

    await Income.findByIdAndDelete(incomeId);

    res.status(200).json({
      success: true,
      message: "Income deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};