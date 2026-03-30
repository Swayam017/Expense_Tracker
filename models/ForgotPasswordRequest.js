const mongoose = require("mongoose");

const forgotPasswordRequestSchema = new mongoose.Schema(
  {
    // MongoDB automatically creates _id (no need for UUID)
    
    isActive: {
      type: Boolean,
      default: true
    },

    // Reference to User (like foreign key)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true // adds createdAt, updatedAt
  }
);

module.exports = mongoose.model(
  "ForgotPasswordRequest",
  forgotPasswordRequestSchema
);