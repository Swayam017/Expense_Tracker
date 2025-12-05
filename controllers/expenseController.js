const Expense = require("../models/Expense");

// CREATE
exports.createExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, amount, date, category } = req.body;

        const expense = await Expense.create({
            description,
            amount,
            date,
            category,
            UserId: userId    // FIXED
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET USER EXPENSES
exports.getExpenses = async (req, res) => {
    try {
        const userId = req.user.id;

        const expenses = await Expense.findAll({
            where: { UserId: userId }    // FIXED
        });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
exports.deleteExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const deleted = await Expense.destroy({
            where: { id, UserId: userId }   // FIXED
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
        const userId = req.user.id;
        const id = req.params.id;

        const updated = await Expense.update(req.body, {
            where: { id, UserId: userId }   // FIXED
        });

        if (!updated[0]) return res.status(403).json({ error: "Unauthorized update" });

        res.send("Expense updated");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
