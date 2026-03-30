const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    // 🔥 Replace UserId with reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Income", incomeSchema);