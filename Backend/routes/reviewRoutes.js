const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Review = require("../models/Review");
const Booking = require("../models/Booking");

const router = express.Router();

// Create review
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Booking and rating are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      household: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Review can only be given for completed bookings"
      });
    }

    const existingReview = await Review.findOne({
      booking: bookingId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted for this booking"
      });
    }

    const review = new Review({
      household: req.user.id,
      helper: booking.helper,
      booking: booking._id,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get helper reviews
router.get("/helper/:helperId", async (req, res) => {
  try {
    const reviews = await Review.find({
      helper: req.params.helperId
    })
      .populate("household", "name")
      .populate("booking", "bookingDate");

    res.status(200).json({
      success: true,
      message: "Helper reviews fetched successfully",
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get helper average rating
router.get("/helper/:helperId/rating", async (req, res) => {
  try {
    const reviews = await Review.find({
      helper: req.params.helperId
    });

    if (reviews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No reviews found for this helper",
        data: {
          averageRating: 0,
          totalReviews: 0
        }
      });
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating = totalRating / reviews.length;

    res.status(200).json({
      success: true,
      message: "Helper rating fetched successfully",
      data: {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get helper completed jobs
router.get("/helper/history", authMiddleware, async (req, res) => {
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
      helper: helper._id,
      status: "completed"
    })
      .populate("household", "-password")
      .populate("servicePlan");

    res.status(200).json({
      success: true,
      message: "Helper job history fetched successfully",
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


module.exports = router;