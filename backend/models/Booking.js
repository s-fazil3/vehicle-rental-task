const mong = require('mongoose');
const bookingschema = new mong.Schema({
    userId: String,
    vehicleId: String,
    hours: Number,
    totalPrice: Number,
    status: { type: String, default: 'booked' },
    startAt: { type: Date },
    endAt: { type: Date },
    paymentStatus: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
    returnedAt: { type: Date }
});
module.exports = mong.model('Booking', bookingschema);