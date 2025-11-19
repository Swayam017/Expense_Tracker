const Expense = require("../models/Expense");

// CREATE
exports.createExpense = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { description, amount, date, category } = req.body;

        const expense = await Expense.create({
            description,
            amount,
            date,
            category,
            userId
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET USER EXPENSES
exports.getExpenses = async (req, res) => {
    try {
        const userId = req.user.userId;

        const expenses = await Expense.findAll({
            where: { userId }
        });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
exports.deleteExpense = async (req, res) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;

        const deleted = await Expense.destroy({
            where: { id, userId }
        });

        if (!deleted) return res.status(403).json({ error: "Unauthorized delete" });

        res.send("Expense deleted");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE
exports.updateExpense = async (req, res) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;

        const updated = await Expense.update(req.body, {
            where: { id, userId }
        });

        if (!updated[0]) return res.status(403).json({ error: "Unauthorized update" });

        res.send("Expense updated");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
