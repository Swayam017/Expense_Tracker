const Expense = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("../utils/db_connections");
const { getCategoryFromAI } = require("../services/aiCategoryService");

/**
 * ================================
 * CREATE EXPENSE
 * ================================
 */
exports.createExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { description, amount, date ,note} = req.body;

    // AI category
    let category = "Other";

      try {
        category = await getCategoryFromAI(description);
      } catch (err) {
        console.error("AI category failed, using default:", err.message);
      }


    const expense = await Expense.create(
      {
        description,
        amount,
        date,
        category,
        note,
        UserId: userId
      },
      { transaction: t }
    );

    // Increment totalSpent safely
    await User.increment(
      { totalSpent: amount },
      { where: { id: userId }, transaction: t }
    );

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense
    });

  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * ================================
 * GET ALL EXPENSES
 * ================================
 */
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Expense.findAndCountAll({
      where: { UserId: userId },
      order: [["date", "DESC"]],
      limit,
      offset
    });

    res.json({
      success: true,
      expenses: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalExpenses: count
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


/**
 * ================================
 * UPDATE EXPENSE
 * ================================
 */
exports.updateExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const expenseId = req.params.id;
    const { amount, description ,note} = req.body;
       // AI category
    let category = "Other";

      try {
        category = await getCategoryFromAI(description);
      } catch (err) {
        console.error("AI category failed, using default:", err.message);
      }

    const expense = await Expense.findOne({
      where: { id: expenseId, UserId: userId }
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    const diff = Number(amount) - Number(expense.amount);

    await expense.update(
  { amount, description, category,note },
  { transaction: t }
);

    await User.increment(
      { totalSpent: diff },
      { where: { id: userId }, transaction: t }
    );

    await t.commit();

    res.json({
      success: true,
      message: "Expense updated successfully"
    });

  } catch (error) {
    await t.rollback();
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
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const expenseId = req.params.id;

    const expense = await Expense.findOne({
      where: { id: expenseId, UserId: userId }
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    await User.decrement(
      { totalSpent: expense.amount },
      { where: { id: userId }, transaction: t }
    );

    await expense.destroy({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Expense deleted successfully"
    });

  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
