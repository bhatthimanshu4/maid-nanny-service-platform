const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Helper = require("../models/Helper");
const ServicePlan = require("../models/ServicePlan");
const upload = require("../middleware/uploadmiddleware");

const router = express.Router();

// Browse, search and filter verified helpers
router.get("/browse", async (req, res) => {
  try {
    const { search, helperType, city } = req.query;

    const filter = {
      verificationStatus: "verified",
      availability: "available"
    };

    if (helperType) {
      filter.helperType = helperType;
    }

    let helpers = await Helper.find(filter)
      .populate("user", "name email phone address city")
      .select("-verificationDocuments")
      .lean();

    if (search) {
      helpers = helpers.filter((helper) =>
        (helper.user?.name || "")
          .toLowerCase()
          .includes(String(search).toLowerCase())
      );
    }

    if (city) {
      helpers = helpers.filter((helper) =>
        (helper.user?.city || "")
          .toLowerCase()
          .includes(String(city).toLowerCase())
      );
    }

    const plans = await ServicePlan.find({
      helper: { $in: helpers.map((helper) => helper._id) },
      isActive: true
    })
      .select("helper planType price description")
      .lean();

    const plansByHelper = new Map();

    for (const plan of plans) {
      const key = plan.helper.toString();
      plansByHelper.set(key, [
        ...(plansByHelper.get(key) || []),
        plan
      ]);
    }

    const visibleHelpers = helpers
      .map((helper) => ({
        ...helper,
        skills: helper.skills || [],
        plans: plansByHelper.get(helper._id.toString()) || []
      }))
      .filter((helper) => helper.plans.length > 0);

    res.status(200).json({
      success: true,
      message: "Helpers fetched successfully",
      data: visibleHelpers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

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

// View an accepted helper profile
router.get("/:id", async (req, res) => {
  try {
    const helper = await Helper.findOne({
      _id: req.params.id,
      verificationStatus: "accepted"
    })
      .populate("user", "name email phone address city")
      .select("-verificationDocuments");

    if (!helper) {
      return res.status(404).json({ success: false, message: "Helper not found" });
    }

    res.status(200).json({
      success: true,
      message: "Helper profile fetched successfully",
      data: helper
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;
