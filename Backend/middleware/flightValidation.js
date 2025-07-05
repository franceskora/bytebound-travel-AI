const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};

const validateFlightOffer = [
    body('flight').isObject().withMessage('Flight data must be an object'),
    handleValidationErrors
];

const validateFlightBooking = [
    body('flightOffer').isObject().withMessage('Flight offer must be an object'),
    body('traveler').isObject().withMessage('Traveler data must be an object'),
    handleValidationErrors
];

module.exports = {
    validateFlightOffer,
    validateFlightBooking
};