
const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/authMiddleware");

// Submit a complaint
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, description, booking } = req.body;

    // Validate required fields
    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: "Complaint subject is required"
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Complaint description is required"
      });
    }

    // Only household and helper can submit complaints
    if (!["household", "helper"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only household and helper can submit complaints"
      });
    }

    const complaintData = {
      raisedBy: req.user.id,
      subject: subject.trim(),
      description: description.trim()
    };

    // Booking is optional
    if (booking) {
      complaintData.booking = booking;
    }

    const complaint = await Complaint.create(complaintData);

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: complaint
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint data"
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


 // Get complaints submitted by the logged-in user
router.get("/my-complaints", authMiddleware, async (req, res) => {
  try {
    if (!["household", "helper"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only household and helper can view their complaints"
      });
    }

    const complaints = await Complaint.find({
      raisedBy: req.user.id
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your complaints fetched successfully",
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


module.exports = router;
