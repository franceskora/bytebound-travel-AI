const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  bookingType: { type: String, enum: ['flight', 'hotel'], required: true },
  // This will store the name of the airline or hotel
  providerName: { type: String, required: true },
  // This will link to a partner if the provider is a registered partner
  partner: { type: mongoose.Schema.ObjectId, ref: 'Partner', default: null },
  amount: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for faster queries
bookingSchema.index({ partner: 1, bookingDate: -1 });

module.exports = mongoose.model('Booking', bookingSchema);