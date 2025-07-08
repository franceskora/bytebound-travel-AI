const express = require('express');
const userController = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes (accessible by authenticated users)
router.put('/profile', validateUserUpdate, userController.updateProfile);
router.put('/preferences', userController.updateUserPreferences);
router.get('/preferences', userController.getUserPreferences);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
    .get(userController.getUsers);

router.route('/:id')
    .get(userController.getUser)
    .put(validateUserUpdate, userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;