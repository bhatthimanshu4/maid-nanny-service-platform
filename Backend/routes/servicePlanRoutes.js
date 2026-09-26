const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Helper = require("../models/Helper");
const ServicePlan = require("../models/ServicePlan");

const router = express.Router();

// Create service plan
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      planType,
      price,
      description
    } = req.body;

    if (!planType || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Plan type and price are required"
      });
    }

    if (!["hourly", "monthly", "yearly"].includes(planType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type"
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

    const plan = new ServicePlan({
      helper: helper._id,
      planType,
      price,
      description
    });

    await plan.save();

    res.status(201).json({
      success: true,
      message: "Service plan created successfully",
      data: plan
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get logged-in helper's service plans
router.get("/", authMiddleware, async (req, res) => {
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

    const plans = await ServicePlan.find({
      helper: helper._id
    });

    res.status(200).json({
      success: true,
      message: "Service plans fetched successfully",
      data: plans
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update service plan
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      planType,
      price,
      description,
      isActive
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

    const plan = await ServicePlan.findOne({
      _id: req.params.id,
      helper: helper._id
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Service plan not found"
      });
    }

    if (
      planType !== undefined &&
      !["hourly", "monthly", "yearly"].includes(planType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type"
      });
    }

    plan.planType = planType ?? plan.planType;
    plan.price = price ?? plan.price;
    plan.description = description ?? plan.description;
    plan.isActive = isActive ?? plan.isActive;

    await plan.save();

    res.status(200).json({
      success: true,
      message: "Service plan updated successfully",
      data: plan
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete service plan
router.delete("/:id", authMiddleware, async (req, res) => {
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

    const plan = await ServicePlan.findOne({
      _id: req.params.id,
      helper: helper._id
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Service plan not found"
      });
    }

    await ServicePlan.findByIdAndDelete(plan._id);

    res.status(200).json({
      success: true,
      message: "Service plan deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;