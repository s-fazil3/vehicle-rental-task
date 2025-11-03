const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes");
const Booking = require("./models/Booking");
const Vehicle = require("./models/Vehicle");
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentsRoutes);
const releaseExpiredBookings = async () => {
  try {
    const now = new Date();
    const expired = await Booking.find({ status: 'booked', endAt: { $lte: now } });
    if (!expired.length) return;
    for (const b of expired) {
      await Vehicle.findByIdAndUpdate(b.vehicleId, { $set: { availability: true } });
      b.status = 'completed';
      await b.save();
    }
    if (expired.length) {
      console.log(`[AUTO-RELEASE] Freed ${expired.length} vehicle(s) at ${now.toISOString()}`);
    }
  } catch (e) {
    console.error('[AUTO-RELEASE] error', e?.message);
  }
};
setInterval(releaseExpiredBookings, 60 * 1000);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));