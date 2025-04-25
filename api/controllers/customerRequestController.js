const CustomerRequest = require('../models/CustomerRequest');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

const RENTAL_DURATION_IN_DAYS = parseInt(process.env.RENTAL_DURATION_IN_DAYS) || 30; 

const VALID_STATES = ['new', 'good', 'used', 'damaged', 'broken'];

// Créer une demande de réservation
exports.createRequest = async (req, res) => {
  const { equipment, request_type } = req.body;
  try {
    const customer = await User.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const equipmentItem = await Equipment.findById(equipment);

    if ((!equipmentItem || equipmentItem.status !== 'available') && request_type === 'rental') {
      return res.status(400).json({ message: 'Equipment not available' });
    }

    if (request_type === 'return') {
      if (equipmentItem.status !== 'unavailable') {
        return res.status(400).json({ message: 'Equipment not rented' });
      }

      // Trouver la dernière demande de type 'rental' acceptée pour cet équipement
      const lastRentalRequest = await CustomerRequest.findOne({
        equipment: equipmentItem._id,
        request_type: 'rental',
        status: 'accepted',
      }).sort({ createdAt: -1 }); // Trier par date de création décroissante pour obtenir la plus récente

      // Vérifier que le client est celui qui a fait cette demande
      if (!lastRentalRequest || lastRentalRequest.customer.toString() !== customer._id.toString()) {
        return res.status(400).json({ message: 'You are not the last customer who rented this equipment' });
      }
    }

    const newRequest = new CustomerRequest({
      customer: customer._id,
      equipment: equipmentItem._id,
      request_type,
      status: 'pending',
      equipment_state: equipmentItem.state,
    });
    await newRequest.save();

    // Mise à jour du statut pour l'équipement
    equipmentItem.status = 'pending';
    await equipmentItem.save();

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

// Récupérer toutes les demandes
exports.getRequests = async (req, res) => {
  try {
    const requests = await CustomerRequest.find().populate('equipment');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

// Récupérer toutes les demandes d'un customer
exports.getCustomerRequests = async (req, res) => {
    try {
      const requests = await CustomerRequest.find({ customer: req.user.id }).populate('equipment');
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
      console.error(err);
    }
  };

// Mettre à jour une demande (valider/refuser)
exports.updateRequest = async (req, res) => {
  const { id } = req.params;
  const { status, state } = req.body;
  try {
    const request = await CustomerRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const customer = await User.findById(request.customer);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const equipment = await Equipment.findById(request.equipment);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }


    // Validation ou refus de la demande
    request.status = status;
    await request.save();

    // Modification de l'état du matériel
    if (VALID_STATES.includes(state)) {
        request.equipment.state = state;
        await request.equipment.save();
        // Mise à jour de l'état du matériel dans la demande
        request.equipment_state = state;
        await request.save();
    }
    

    // Envoi de l'email de confirmation/refus
    if (status === 'accepted') {
      equipment.status = 'unavailable';
      await equipment.save();
      request.start_date = new Date();
      request.save();
      await sendEmail(
        customer.email,
        'Confirmation de réservation',
        `Votre réservation pour le matériel "${equipment.name}" a été acceptée.\n
        Vous pouvez venir le récupérer dès à présent.\n
        Merci de retourner le produit d'ici ${RENTAL_DURATION_IN_DAYS} jours à partir d'aujourd'hui.\n`
      );
    } else if (status === 'denied') {
      equipment.status = 'available';
      await equipment.save();
      await sendEmail(
        customer.email,
        'Refus de réservation',
        `Votre réservation pour le matériel "${equipment.name}" a été refusée.`
      );
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};
