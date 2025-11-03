const exp = require('express');
const router = exp.Router();
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { auth } = require('../middleware/auth');

router.post('/book', auth, async (req, res) => {
    try {
        const { userId, vehicleId, hours, totalPrice, startAt, endAt } = req.body;
        // validate vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        // If date range provided, check for overlap against active bookings
        if (startAt && endAt) {
          const start = new Date(startAt);
          const end = new Date(endAt);
          if (!(start < end)) return res.status(400).json({ message: 'Invalid date range' });
          const overlap = await Booking.findOne({
            vehicleId,
            status: { $in: ['booked'] },
            startAt: { $lt: end },
            endAt: { $gt: start }
          });
          if (overlap) return res.status(400).json({ message: 'Vehicle not available for selected dates' });
        }

        // Toggle simple availability for immediate rentals
        let updatedVehicle = vehicle;
        if (!startAt || !endAt) {
          updatedVehicle = await Vehicle.findOneAndUpdate(
            { _id: vehicleId, availability: { $ne: false } },
            { $set: { availability: false } },
            { new: true }
          );
          if (!updatedVehicle) return res.status(400).json({ message: 'Vehicle already booked' });
        }

        const booking = new Booking({
          userId,
          vehicleId,
          hours,
          totalPrice,
          startAt: startAt ? new Date(startAt) : (!startAt && hours ? new Date() : undefined),
          endAt: endAt ? new Date(endAt) : (!endAt && hours ? new Date(Date.now() + (Number(hours || 0) * 60 * 60 * 1000)) : undefined),
        });
        await booking.save();
        res.json({ message: 'Booking successful', vehicle: updatedVehicle, bookingId: booking._id });
      } catch (err) {
          console.error('[BOOK] error', err.message);
          res.status(400).json({ message: err.message });
      }
});

router.get('/:userId', auth, async (req, res) => {
    try {
        const booking= await Booking.find({ userId: req.params.userId });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/return', auth, async (req, res) => {
    try {
      const { bookingId } = req.body;
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      // Optional ownership check: user can only return own booking (admins can be handled later if needed)
      if (String(booking.userId) !== String(req.user.id)) {
        return res.status(403).json({ message: 'Not allowed' });
      }
      booking.status = 'returned';
      booking.returnedAt = new Date();
      await booking.save();
      // Free vehicle for immediate rentals
      await Vehicle.findByIdAndUpdate(booking.vehicleId, { $set: { availability: true } });
      res.json({ message: 'Return processed' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

module.exports = router;