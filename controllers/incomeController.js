const Income = require("../models/Income");
const User = require("../models/User");
const sequelize = require("../utils/db_connections");

// =======================
// CREATE INCOME
// =======================
exports.createIncome = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const income = await Income.create(
      {
        source,
        amount,
        date,
        UserId: userId
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// =======================
// GET ALL INCOME
// =======================
exports.getIncome = async (req, res) => {
  try {
    const incomes = await Income.findAll({
      where: { UserId: req.user.id },
      order: [["date", "DESC"]]
    });

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

// =======================
// UPDATE INCOME
// =======================
exports.updateIncome = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const incomeId = req.params.id;
    const { source, amount, date } = req.body;

    const income = await Income.findOne({
      where: { id: incomeId, UserId: userId }
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found"
      });
    }

    income.source = source ?? income.source;
    income.amount = amount ?? income.amount;
    income.date = date ?? income.date;

    await income.save({ transaction: t });
    await t.commit();

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      income
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// =======================
// DELETE INCOME
// =======================
exports.deleteIncome = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const incomeId = req.params.id;

    const income = await Income.findOne({
      where: { id: incomeId, UserId: userId }
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found"
      });
    }

    await income.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({
      success: true,
      message: "Income deleted successfully"
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
