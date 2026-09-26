const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const authRoutes = require("./routes/authRoutes");
app.use(express.json());
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const helperRoutes = require("./routes/helperRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/helpers", helperRoutes);

const servicePlanRoutes = require("./routes/servicePlanRoutes");
app.use("/api/service-plans", servicePlanRoutes);

const bookingRoutes = require("./routes/BookingRoutes");
app.use("/api/bookings", bookingRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// start the server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});