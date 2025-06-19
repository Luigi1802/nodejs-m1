const Equipment = require('../models/Equipment');

// Ajouter un nouvel équipement
exports.addEquipment = async (req, res) => {
  const { name, description, serial_number, picture, status, state } = req.body;
  try {
    const newEquipment = new Equipment({ name, description, serial_number, picture, status, state });
    await newEquipment.save();
    res.status(201).json(newEquipment);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

// Mettre à jour un équipement existant
exports.updateEquipment = async (req, res) => {
  const { id } = req.params;
  const { name, description, serial_number, picture, status, state } = req.body;
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      id,
      { name, description, serial_number, picture, status, state },
      { new: true }
    );
    // Verifier si l'équipement existe
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

// Supprimer un équipement
exports.deleteEquipment = async (req, res) => {
  const { id } = req.params;
  try {
    const equipment = await Equipment.findByIdAndDelete(id);
    // Vérifier si l'équipement existe
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json({ message: 'Equipment successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

// Récupérer tous les matériels
exports.getAllEquipment = async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.json(equipments);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

// Récupérer les matériels disponibles
exports.getAllAvailableEquipments = async (req, res) => {
  try {
    const availableEquipments = await Equipment.find({ status: 'available' });
    res.json(availableEquipments);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

exports.getAllUnavailableEquipments = async (req, res) => {
  try {
    const unavailableEquipments = await Equipment.find({ 
      status: { $in: ['unavailable', 'pending'] } 
    });
    res.json(unavailableEquipments);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};