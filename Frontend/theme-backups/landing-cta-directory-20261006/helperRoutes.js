const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Helper = require("../models/Helper");
const upload = require("../middleware/uploadmiddleware");

const router = express.Router();

// Get logged-in helper profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const helper = await Helper.findOne({
      user: req.user.id
    }).populate("user", "-password");

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper profile not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Helper profile fetched successfully",
      data: helper
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update logged-in helper profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      helperType,
      experience,
      skills,
      availability,
      bio
    } = req.body;

    const helper = await Helper.findOne({
      user: req.user.id
    });

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper profile not found"
      });
    }

    helper.helperType = helperType ?? helper.helperType;
    helper.experience = experience ?? helper.experience;
    helper.skills = skills ?? helper.skills;
    helper.availability = availability ?? helper.availability;
    helper.bio = bio ?? helper.bio;

    await helper.save();

    res.status(200).json({
      success: true,
      message: "Helper profile updated successfully",
      data: helper
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}); 

// Update helper availability
router.put("/availability", authMiddleware, async (req, res) => {
  try {
    const { availability } = req.body;

    if (!availability) {
      return res.status(400).json({
        success: false,
        message: "Availability is required"
      });
    }

    if (!["available", "unavailable"].includes(availability)) {
      return res.status(400).json({
        success: false,
        message: "Availability must be available or unavailable"
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

    helper.availability = availability;

    await helper.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: {
        availability: helper.availability
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload helper verification document
router.post("/verification-documents",authMiddleware,upload.single("document"),async (req, res) => {
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

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Verification document is required"
        });
      }

      helper.verificationDocuments.push(req.file.path);

      await helper.save();

      res.status(200).json({
        success: true,
        message: "Verification document uploaded successfully",
        data: {
          file: req.file.path,
          verificationDocuments: helper.verificationDocuments
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