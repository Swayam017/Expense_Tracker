const express = require("express");
const router = express.Router();
const {
  addNote,
  getNotes,
  updateNote,
  deleteNote
} = require("../controllers/noteController");

const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, addNote);
router.get("/", authenticate, getNotes);
router.put("/:id", authenticate, updateNote);
router.delete("/:id", authenticate, deleteNote);

module.exports = router;
