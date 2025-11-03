const mong= require('mongoose');

const vehicleschema = new mong.Schema({
    name:{ type:String, required: true},
    type:{type: String, required: true},
    pricePerHour:{type: Number, required: true},
    image: String,
    availability: { type: Boolean, default: true },
});

module.exports = mong.model('Vehicle', vehicleschema);