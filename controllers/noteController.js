const Note = require("../models/Note");

// =======================
// CREATE NOTE
// =======================
exports.addNote = async (req, res) => {
  try {
    const { note, date } = req.body;

    const newNote = await Note.create({
      note,
      date,
      UserId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note: newNote
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add note" });
  }
};

// =======================
// GET ALL NOTES (USER WISE)
// =======================
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { UserId: req.user.id },
      order: [["date", "DESC"]]
    });

    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// =======================
// UPDATE NOTE
// =======================
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, date } = req.body;

    const existingNote = await Note.findOne({
      where: { id, UserId: req.user.id }
    });

    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    existingNote.note = note;
    existingNote.date = date;

    await existingNote.save();

    res.json({
      success: true,
      message: "Note updated successfully",
      note: existingNote
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update note" });
  }
};

// =======================
// DELETE NOTE
// =======================
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Note.destroy({
      where: {
        id,
        UserId: req.user.id
      }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note" });
  }
};
