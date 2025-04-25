const CustomerRequest = require('../models/CustomerRequest');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// Chargement de la durée de location depuis les variables d'environnement
const RENTAL_DURATION_IN_DAYS = parseInt(process.env.RENTAL_DURATION_IN_DAYS) || 30; 

// Liste des états valides pour les équipements
const VALID_STATES = ['new', 'good', 'used', 'damaged', 'broken'];

// Créer une demande de réservation / retour
exports.createRequest = async (req, res) => {
  const { equipment, request_type } = req.body;
  try {
    // Vérification du customer qui opère la demande
    const customer = await User.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // Vérification de l'équipement demandé
    const equipmentItem = await Equipment.findById(equipment);
    if ((!equipmentItem || equipmentItem.status !== 'available') && request_type === 'rental') {
      return res.status(400).json({ message: 'Equipment not available' });
    }
    // Cas de la demande de retour
    if (request_type === 'return') {
      // L'équipement doit être déjà loué
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
        return res.status(400).json({ message: 'You are not the customer who rented this equipment' });
      }
    }

    // Création de la demande
    const newRequest = new CustomerRequest({
      customer: customer._id,
      equipment: equipmentItem._id,
      request_type,
      status: 'pending',
      equipment_state: equipmentItem.state,
    });
    await newRequest.save();

    // Mise à jour du statut pour l'équipement
    equipmentItem.status = 'pending'; // "pending" tant que la demande n'est pas traitée
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

// Récupérer toutes les demandes du customer opérant la requête
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
    // Vérification de l'existence de la demande
    const request = await CustomerRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // La demande ne doit pas être déjà traitée
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' }); 
    }

    // Récupération du customer et de l'équipement associés à la demande
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

    // Modification de l'état de l'équipement (si valide)
    if (VALID_STATES.includes(state)) {
      // Mise à jour de l'état de l'équipement 
      equipment.state = state;
      await equipment.save();
      // Mise à jour de l'état de l'équipement dans la demande
      request.equipment_state = state;
      await request.save();
    }
    
    // Mise a jour du statut de la demande et envoi de l'email de confirmation/refus
    if (status === 'accepted') {
      // Mise a jour du statut de la demande
      equipment.status = request.request_type === 'rental' ? 'unavailable' : 'available';
      await equipment.save();
      // En cas de réservation, on met à jour la date de début de location
      if (request.request_type === 'rental') {
        request.start_date = new Date();
        request.save();
      } else {
        request.end_date = new Date();
        request.save();
      }
      // Envoi de l'email de confirmation
      mailObject = request.request_type === 'rental' ? 'Confirmation de réservation' : 'Confirmation de retour';
      mailBody = request.request_type === 'rental' ? 
        `Votre réservation pour le matériel "${equipment.name}" a été acceptée.\n
        Vous pouvez venir le récupérer dès à présent.\n
        Merci de retourner le produit d'ici ${RENTAL_DURATION_IN_DAYS} jours à partir d'aujourd'hui.\n` :
        `Votre retour pour le matériel "${equipment.name}" a été accepté.\n
        Bonne journée.\n`;
      await sendEmail(
        customer.email,
        mailObject,
        mailBody
      );
    } else if (status === 'denied') {
      // Mise a jour du statut de la demande
      equipment.status = request.request_type === 'return' ? 'unavailable' : 'available';
      await equipment.save();
      // Envoi de l'email de confirmation
      mailObject = request.request_type === 'rental' ? 'Refus de la réservation' : 'Refus du retour';
      mailBody = request.request_type === 'rental' ? 
        `Votre réservation pour le matériel "${equipment.name}" a été refusée.` :
        `Votre retour pour le matériel "${equipment.name}" a été refusé.`;
      await sendEmail(
        customer.email,
        mailObject,
        mailBody
      );
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};
