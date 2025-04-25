const mongoose = require('mongoose');

const RENTAL_DURATION_IN_DAYS = parseInt(process.env.RENTAL_DURATION_IN_DAYS) || 30; 

const CustomerRequestModel = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
        request_type: { type: String, enum: ['rental', 'return'], required: true },
        status: { type: String, enum: ['accepted', 'denied', 'pending'], required: true },
        equipment_state: { type: String, enum: ['new', 'good', 'used', 'damaged', 'broken'], required: true },
        start_date: { type: Date, required: false },
        end_date: { type: Date, required: false },
    },
    {
        timestamps: true
    }
);

// Autocomplete start_date and end_date
CustomerRequestModel.pre('save', function (next) {
  
    if (!this.end_date && this.start_date) {
      // Set the end_date to 30 days after the start_date
      const endDate = new Date(this.start_date);
      endDate.setDate(endDate.getDate() + RENTAL_DURATION_IN_DAYS);
      this.end_date = endDate;
    }
  
    next();
  });

module.exports = mongoose.model('CustomerRequest', CustomerRequestModel);