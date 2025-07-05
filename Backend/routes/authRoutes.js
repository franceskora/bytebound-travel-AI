const express = require('express');
const {
    register,
    login,
    getMe,
    logout,
    updatePassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
    validateUserRegistration,
    validateUserLogin,
    validatePasswordChange
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/updatepassword', validatePasswordChange, updatePassword);

module.exports = router;