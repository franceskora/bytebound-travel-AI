const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  businessName: { type: String, required: true, unique: true },
  businessType: { type: String, enum: ['hotel', 'airline', 'tour_operator'], required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);