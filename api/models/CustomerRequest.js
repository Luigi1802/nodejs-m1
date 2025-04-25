const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const RENTAL_DURATION_IN_DAYS = parseInt(process.env.RENTAL_DURATION_IN_DAYS) || 30; 

const CustomerRequestModel = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
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
    if (!this.start_date) {
      this.start_date = this.createdAt || new Date();
    }
  
    if (!this.end_date) {
      const endDate = new Date(this.start_date);
      endDate.setDate(endDate.getDate() + RENTAL_DURATION_IN_DAYS);
      this.end_date = endDate;
    }
  
    next();
  });

module.exports = mongoose.model('CustomerRequest', CustomerRequestModel);