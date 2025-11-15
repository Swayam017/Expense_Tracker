const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

// CREATE
router.post("/", expenseController.createExpense);

// READ
router.get("/", expenseController.getExpenses);

// DELETE
router.delete("/:id", expenseController.deleteExpense);

// UPDATE
router.put("/:id", expenseController.updateExpense);

module.exports = router;
