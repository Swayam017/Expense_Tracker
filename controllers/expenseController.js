const Expense = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("../utils/db_connections");

/**
 * ============================
 * CREATE EXPENSE
 * ============================
 */
exports.createExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { description, amount, date, category } = req.body;

    // 1️⃣ Create expense
    const expense = await Expense.create(
      {
        description,
        amount,
        date,
        category,
        UserId: userId
      },
      { transaction: t }
    );

    // 2️⃣ Update totalSpent
    req.user.totalSpent =
      Number(req.user.totalSpent) + Number(amount);

    await req.user.save({ transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      expense,
      totalSpent: req.user.totalSpent
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
 * ============================
 * GET USER EXPENSES
 * ============================
 */
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.findAll({
      where: { UserId: userId },
      order: [["date", "DESC"]]
    });

    res.json({
      success: true,
      expenses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * ============================
 * DELETE EXPENSE
 * ============================
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
      return res.status(403).json({
        success: false,
        message: "Unauthorized delete"
      });
    }

    // 🔥 Reduce totalSpent
    req.user.totalSpent =
      Number(req.user.totalSpent) - Number(expense.amount);

    await req.user.save({ transaction: t });
    await expense.destroy({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Expense deleted",
      totalSpent: req.user.totalSpent
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
 * ============================
 * UPDATE EXPENSE
 * ============================
 */
exports.updateExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const expenseId = req.params.id;
    const { amount } = req.body;

    const expense = await Expense.findOne({
      where: { id: expenseId, UserId: userId }
    });

    if (!expense) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized update"
      });
    }

    // 🔥 Adjust totalSpent (new - old)
    const difference =
      Number(amount) - Number(expense.amount);

    req.user.totalSpent += difference;

    await expense.update(req.body, { transaction: t });
    await req.user.save({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Expense updated",
      totalSpent: req.user.totalSpent
    });

  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
