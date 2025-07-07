const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide a rating between 1 and 5']
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    // The business being reviewed (can be a hotel, airline, etc.)
    providerName: {
        type: String,
        required: true,
    },
    bookingType: {
        type: String,
        required: true,
        enum: ['flight', 'hotel', 'activity']
    },
    // The user who wrote the review
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Prevent a user from submitting more than one review for the same provider
reviewSchema.index({ providerName: 1, bookingType: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);