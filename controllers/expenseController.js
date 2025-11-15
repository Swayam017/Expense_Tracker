const Expense = require("../models/Expense");

// CREATE Expense
exports.createExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET all expenses
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE expense
exports.deleteExpense = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Expense.destroy({ where: { id } });

        if (!deleted) return res.status(404).send("Expense not found");

        res.send("Expense deleted");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE expense
exports.updateExpense = async (req, res) => {
    try {
        const id = req.params.id;

        const updated = await Expense.update(req.body, { where: { id } });

        if (!updated[0]) return res.status(404).send("Expense not found");

        res.send("Expense updated");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
