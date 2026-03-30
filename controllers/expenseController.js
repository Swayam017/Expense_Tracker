const Expense = require("../models/Expense");
const User = require("../models/User");
const { getCategoryFromAI } = require("../services/aiCategoryService");

/**
 * ================================
 * CREATE EXPENSE
 * ================================
 */
exports.createExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const { description, amount, date, note } = req.body;

    const category = "Other";

    // Create expense
    const expense = await Expense.create({
      description,
      amount,
      date,
      category,
      note,
      user: userId
    });

    // 🔥 Increment totalSpent
    await User.findByIdAndUpdate(userId, {
      $inc: { totalSpent: amount }
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense
    });

    // 🔥 AI category update (background)
    getCategoryFromAI(description)
      .then((category) => {
        return Expense.findByIdAndUpdate(expense._id, { category });
      })
      .catch((err) => console.error("AI category failed:", err));

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/**
 * ================================
 * GET ALL EXPENSES (Pagination)
 * ================================
 */
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // 🔥 count + fetch
    const total = await Expense.countDocuments({ user: userId });

    const expenses = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      expenses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalExpenses: total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/**
 * ================================
 * UPDATE EXPENSE
 * ================================
 */
exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenseId = req.params.id;
    const { amount, description, note } = req.body;

    const expense = await Expense.findOne({
      _id: expenseId,
      user: userId
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    let category = expense.category;

    // Call AI only if description changed
    if (description && description !== expense.description) {
      category = await getCategoryFromAI(description);
    }

    const diff = Number(amount) - Number(expense.amount);

    // Update expense
    expense.amount = amount;
    expense.description = description;
    expense.category = category;
    expense.note = note;

    await expense.save();

    // Update totalSpent
    await User.findByIdAndUpdate(userId, {
      $inc: { totalSpent: diff }
    });

    res.json({
      success: true,
      message: "Expense updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/**
 * ================================
 * DELETE EXPENSE
 * ================================
 */
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenseId = req.params.id;

    const expense = await Expense.findOne({
      _id: expenseId,
      user: userId
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    // 🔥 Decrement totalSpent
    await User.findByIdAndUpdate(userId, {
      $inc: { totalSpent: -expense.amount }
    });

    // Delete expense
    await Expense.findByIdAndDelete(expenseId);

    res.json({
      success: true,
      message: "Expense deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};