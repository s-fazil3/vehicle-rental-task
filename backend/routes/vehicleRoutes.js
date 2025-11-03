const exp = require('express');
const router = exp.Router();
const Vehicle = require('../models/Vehicle');
const { auth, adminOnly } = require('../middleware/auth');
const cloudinary = require('../Config/cloudinary');

router.get('/', async (req, res) => {
    try{
    const vehicles = await Vehicle.find();
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const total = vehicles.length;
    const booked = vehicles.filter(v => v.availability === false).length;
    const available = total - booked;
    console.log('[VEHICLES] total:', total, 'available:', available, 'booked:', booked);
    res.json(vehicles);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

router.post('/add', auth, adminOnly, async (req, res) => {
    try{
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.json({ message: 'Vehicle added' });
    } catch(err){
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vehicle deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/upload', auth, adminOnly, async (req, res) => {
    try {
        const { image } = req.body; // base64 data URL or remote URL
        if (!image) return res.status(400).json({ message: 'No image provided' });
        const result = await cloudinary.uploader.upload(image, { folder: 'vehicle-rental' });
        return res.json({ url: result.secure_url, public_id: result.public_id });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;