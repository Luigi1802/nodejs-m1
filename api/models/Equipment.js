const mongoose = require('mongoose');

// Schéma des équipements
const EquipmentModel = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    serial_number: { type: String, required: true, unique: true},
    picture: { type: String, required: false },
    status: { type: String,  enum: ['available', 'unavailable', 'pending'], required: true },
    state: { type: String, enum: ['new', 'good', 'used', 'damaged', 'broken'], required: true },
},
{
    timestamps: true
});

module.exports = mongoose.model('Equipment', EquipmentModel);