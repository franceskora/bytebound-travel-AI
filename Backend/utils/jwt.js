const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Send token response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
    // Create token
    const token = generateToken(user._id);

    // Cookie options
    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict'
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            status: 'success',
            message,
            token,
            data: {
                user: user.getPublicProfile()
            }
        });
};

module.exports = {
    generateToken,
    sendTokenResponse
};
