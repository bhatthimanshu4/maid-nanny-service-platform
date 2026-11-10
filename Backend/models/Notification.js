
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ["verification_pending", "verification_approved"]
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    actionType: {
      type: String,
      enum: ["verify_now", "set_availability"],
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isResolved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
