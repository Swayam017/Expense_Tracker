const Note = require("../models/Note");

/**
 * =======================
 * CREATE NOTE
 * =======================
 */
exports.addNote = async (req, res) => {
  try {
    const { note, date } = req.body;

    const newNote = await Note.create({
      note,
      date,
      user: req.user._id   // 🔥 FIX
    });

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note: newNote
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add note",
      error: error.message
    });
  }
};


/**
 * =======================
 * GET ALL NOTES (USER WISE)
 * =======================
 */
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id
    }).sort({ date: -1 });

    res.json({
      success: true,
      notes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message
    });
  }
};


/**
 * =======================
 * UPDATE NOTE
 * =======================
 */
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, date } = req.body;

    const existingNote = await Note.findOne({
      _id: id,
      user: req.user._id
    });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    // Update fields
    if (note !== undefined) existingNote.note = note;
    if (date !== undefined) existingNote.date = date;

    await existingNote.save();

    res.json({
      success: true,
      message: "Note updated successfully",
      note: existingNote
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update note",
      error: error.message
    });
  }
};


/**
 * =======================
 * DELETE NOTE
 * =======================
 */
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      _id: id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    await Note.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Note deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message
    });
  }
};