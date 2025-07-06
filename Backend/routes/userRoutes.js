const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateProfile
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes (accessible by authenticated users)
router.put('/profile', validateUserUpdate, updateProfile);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUser)
    .put(validateUserUpdate, updateUser)
    .delete(deleteUser);

module.exports = router;
