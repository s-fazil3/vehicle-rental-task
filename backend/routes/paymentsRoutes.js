const exp = require('express');
const router = exp.Router();
const { auth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Stripe = require('stripe');

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

router.post('/intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'inr', metadata = {} } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    if (!stripe) {
      return res.json({ clientSecret: 'mock_client_secret', mocked: true });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/confirm', auth, async (req, res) => {
  try {
    const { bookingId, status = 'succeeded' } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.userId) !== String(req.user.id)) return res.status(403).json({ message: 'Not allowed' });
    booking.paymentStatus = status;
    await booking.save();
    return res.json({ message: 'Payment status updated' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
