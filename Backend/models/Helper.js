const mongoose = require("mongoose");

const helperSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    helperType: {
      type: String,
      enum: ["maid", "nanny"],
      required: true
    },

    experience: {
      type: Number,
      default: 0
    },

    skills: {
      type: [String],
      default: []
    },

    availability: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available"
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },

    verificationDocuments: {
      type: [String],
      default: []
    },

    bio: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Helper", helperSchema);