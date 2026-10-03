const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Helper = require("../models/Helper");
const User = require("../models/User");


const router = express.Router();


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