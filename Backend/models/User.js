const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      trim: true
    },

    city: {
      type: String,
      trim: true
    },

    role: {
      type: String,
      enum: ["household", "admin"],
      default: "household"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);