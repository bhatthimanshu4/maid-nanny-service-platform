const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Helper = require("../models/Helper");

const router = express.Router();

// Update helper verification status
router.put(
  "/helpers/:helperId/verification",
  authMiddleware,
  async (req, res) => {
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