const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Helper = require("../models/Helper");
const User = require("../models/User");
const Booking = require("../models/Booking");
const ServiceCategory = require("../models/ServiceCategory");


const router = express.Router();


router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

    const totalUsers = await User.countDocuments({
      role: { $ne: "admin" }
    });

    const totalHouseholds = await User.countDocuments({
      role: "household"
    });

    const totalHelpers = await User.countDocuments({
      role: "helper"
    });

    const verifiedHelpers = await Helper.countDocuments({
      verificationStatus: "verified"
    });

    const pendingHelpers = await Helper.countDocuments({
      verificationStatus: "pending"
    });

    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      status: "pending"
    });

    const acceptedBookings = await Booking.countDocuments({
      status: "accepted"
    });

    const completedBookings = await Booking.countDocuments({
      status: "completed"
    });

    const rejectedBookings = await Booking.countDocuments({
      status: "rejected"
    });

    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled"
    });

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        users: {
          total: totalUsers,
          households: totalHouseholds,
          helpers: totalHelpers
        },
        helpers: {
          verified: verifiedHelpers,
          pending: pendingHelpers
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          accepted: acceptedBookings,
          completed: completedBookings,
          rejected: rejectedBookings,
          cancelled: cancelledBookings
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

const users = await User.find({
  role: { $ne: "admin" }
})
  .select("-password")
  .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user details
router.get("/users/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

    const user = await User.findOne({
      _id: req.params.id,
      role: { $ne: "admin" }
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Activate or deactivate user
router.put("/users/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false"
      });
    }

    const user = await User.findOne({
      _id: req.params.id,
      role: { $ne: "admin" }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

//create service Plan categories
router.post("/categories", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const existingCategory = await ServiceCategory.findOne({
      name: name.trim()
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category = await ServiceCategory.create({
      name: name.trim(),
      description
    });

    res.status(201).json({
      success: true,
      message: "Service category created successfully",
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// get all details of categories

router.get("/categories", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

    const categories = await ServiceCategory.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Service categories fetched successfully",
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

//update the categroies

router.put("/categories/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

    const { name, description } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name cannot be empty"
      });
    }

    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service category not found"
      });
    }

    if (name !== undefined) {
      const trimmedName = name.trim();

      const existingCategory = await ServiceCategory.findOne({
        name: trimmedName,
        _id: { $ne: category._id }
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Category name already exists"
        });
      }

      category.name = trimmedName;
    }

    if (description !== undefined) {
      category.description = description;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Service category updated successfully",
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category name already exists"
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// status chnage active dactive 

router.put("/categories/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false"
      });
    }

    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service category not found"
      });
    }

    category.isActive = isActive;
    await category.save();

    res.status(200).json({
      success: true,
      message: isActive
        ? "Category activated successfully"
        : "Category deactivated successfully",
      data: category
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// // Get all bookings
// router.get("/bookings", authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Admin only"
//       });
//     }

//     const bookings = await Booking.find()
//       .populate("household", "-password")
//       .populate({
//         path: "helper",
//         populate: {
//           path: "user",
//           select: "name email phone city"
//         }
//       })
//       .populate("servicePlan")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "Bookings fetched successfully",
//       data: bookings
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// Get booking details
router.get("/bookings/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("household", "-password")
      .populate({
        path: "helper",
        populate: {
          path: "user",
          select: "name email phone city"
        }
      })
      .populate("servicePlan");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking details fetched successfully",
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all bookings with optional status filter
router.get("/bookings", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only"
      });
    }

    const { status } = req.query;

    const filter = {};

    if (status) {
      const allowedStatuses = [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking status"
        });
      }

      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate("household", "-password")
      .populate({
        path: "helper",
        populate: {
          path: "user",
          select: "name email phone city"
        }
      })
      .populate("servicePlan")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update helper verification status
router.put("/helpers/:helperId/verification",authMiddleware,async (req, res) => {
    try {
      const { verificationStatus } = req.body;

      if (!["verified", "rejected", "pending"].includes(verificationStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification status"
        });
      }

      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only admin can update verification status"
        });
      }

      const helper = await Helper.findById(req.params.helperId);

      if (!helper) {
        return res.status(404).json({
          success: false,
          message: "Helper not found"
        });
      }

      helper.verificationStatus = verificationStatus;

      await helper.save();

      res.status(200).json({
        success: true,
        message: "Helper verification status updated successfully",
        data: {
          helperId: helper._id,
          verificationStatus: helper.verificationStatus
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);



module.exports = router;