const mongoose = require("mongoose");

const servicePlanSchema = new mongoose.Schema(
  {
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Helper",
      required: true
    },

    planType: {
      type: String,
      enum: ["hourly", "monthly", "yearly"],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ServicePlan", servicePlanSchema);