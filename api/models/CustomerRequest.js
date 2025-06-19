const mongoose = require('mongoose');

// Durée de location par défaut (en jours)
const RENTAL_DURATION_IN_DAYS = parseInt(process.env.RENTAL_DURATION_IN_DAYS) || 30; 
const REMINDER_BEFORE_RENTAL_ENDING_IN_DAYS = parseInt(process.env.REMINDER_BEFORE_RENTAL_ENDING_IN_DAYS) || 7;

// Schema des demandes de réservation/retour d'équipement
const CustomerRequestModel = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
        request_type: { type: String, enum: ['rental', 'return'], required: true },
        status: { type: String, enum: ['accepted', 'denied', 'pending'], required: true },
        equipment_state: { type: String, enum: ['new', 'good', 'used', 'damaged', 'broken'], required: true },
        start_date: { type: Date, required: false },
        end_date: { type: Date, required: false },
        reminder_sent: { type: Boolean, default: false, required: false },
    },
    {
        timestamps: true
    }
);

// Autocomplétion de la date de fin si elle n'est pas fournie
CustomerRequestModel.pre('save', function (next) {
  
    if (!this.end_date && this.start_date) {
      const endDate = new Date(this.start_date);
      endDate.setDate(endDate.getDate() + RENTAL_DURATION_IN_DAYS);
      this.end_date = endDate;
    }
  
    next();
  });

// Méthode pour trouver les rappels à envoyer
CustomerRequestModel.statics.findPendingReminders = function () {
    let soon_date = new Date();
    soon_date.setDate(soon_date.getDate() + REMINDER_BEFORE_RENTAL_ENDING_IN_DAYS); // Date de fin proche
    soon_date.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour la comparaison

    // Rechercher les réservations actives dont la date de fin est proche
    const rentals_to_remind = this.find({
        request_type: 'rental',
        status: 'accepted',
        end_date: { $lt: soon_date }, 
        reminder_sent: false, // Rappel non envoyé
    });

    return rentals_to_remind;
};

module.exports = mongoose.model('CustomerRequest', CustomerRequestModel);