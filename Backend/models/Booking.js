const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Helper",
      required: true
    },

    servicePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePlan",
      required: true
    },

    bookingDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled"
      ],
      default: "pending"
    },

    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);