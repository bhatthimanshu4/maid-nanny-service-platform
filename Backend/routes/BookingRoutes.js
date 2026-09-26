const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");
const Helper = require("../models/Helper");
const ServicePlan = require("../models/ServicePlan");

const router = express.Router();

// Create booking
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      helperId,
      servicePlanId,
      bookingDate,
      notes
    } = req.body;

    if (!helperId || !servicePlanId || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "Helper, service plan and booking date are required"
      });
    }

    const helper = await Helper.findById(helperId);

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper not found"
      });
    }

    const servicePlan = await ServicePlan.findOne({
      _id: servicePlanId,
      helper: helperId,
      isActive: true
    });

    if (!servicePlan) {
      return res.status(404).json({
        success: false,
        message: "Active service plan not found"
      });
    }

    const booking = new Booking({
      household: req.user.id,
      helper: helperId,
      servicePlan: servicePlanId,
      bookingDate,
      notes
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking request created successfully",
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get helper's bookings
router.get("/helper", authMiddleware, async (req, res) => {
  try {
    const helper = await Helper.findOne({
      user: req.user.id
    });

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper profile not found"
      });
    }

    const bookings = await Booking.find({
      helper: helper._id
    })
      .populate("household", "-password")
      .populate("servicePlan");

    res.status(200).json({
      success: true,
      message: "Helper bookings fetched successfully",
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Accept or reject booking
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected"
      });
    }

    const helper = await Helper.findOne({
      user: req.user.id
    });

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper profile not found"
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      helper: helper._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be accepted or rejected"
      });
    }

    booking.status = status;

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;