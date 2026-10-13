const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Helper = require("../models/Helper");

const router = express.Router();

function createAuthToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from the backend environment");
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

// register user
router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city
    } = req.body;

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    // Check required fields
    if (!name?.trim?.() || !normalizedEmail || !password || !phone?.trim?.()) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and phone are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone.trim(),
      address,
      city
    });

    const token = createAuthToken(user);

    // Save user to MongoDB
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    // Check required fields
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare entered password with hashed password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
        if (!user.isActive) {
  return res.status(403).json({
    success: false,
    message: "Your account is inactive. Please contact admin."
  });
}

    const token = createAuthToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// Helper
router.post("/helper-register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      helperType,
      experience,
      skills,
      bio
    } = req.body;

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (
      !name?.trim?.() ||
      !normalizedEmail ||
      !password ||
      !phone?.trim?.() ||
      !["maid", "nanny"].includes(helperType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, phone, and a valid helper type are required"
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone.trim(),
      address,
      city,
      role: "helper"
    });

    const helper = new Helper({
      user: user._id,
      helperType,
      experience,
      skills,
      bio
    });

    const token = createAuthToken(user);

    await user.save();
    await helper.save();

    res.status(201).json({
      success: true,
      message: "Helper registered successfully",
      token,
      data: {
        id: user._id,
        userId: user._id,
        helperId: helper._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        helperType: helper.helperType,
        verificationStatus: helper.verificationStatus
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
