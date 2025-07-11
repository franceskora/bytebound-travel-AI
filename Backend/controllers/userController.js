const User = require('../models/User');
const neo4jService = require('../services/neo4jService');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Build query
        let query = {};
        
        // Filter by role if specified
        if (req.query.role) {
            query.role = req.query.role;
        }

        // Filter by active status if specified
        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === 'true';
        }

        // Search by name or email
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        // Pagination info
        const pagination = {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        };

        res.status(200).json({
            status: 'success',
            count: users.length,
            pagination,
            data: {
                users: users.map(user => user.getPublicProfile())
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: user.getPublicProfile()
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            isActive: req.body.isActive
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => 
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(
            req.params.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: {
                user: user.getPublicProfile()
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot delete your own account'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => 
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Ensure user node exists in Neo4j
        await neo4jService.createUserNode(req.user.id);

        // Handle preferences if provided
        if (req.body.preferences) {
            for (const prefType in req.body.preferences) {
                const preferences = req.body.preferences[prefType];
                if (Array.isArray(preferences)) {
                    for (const pref of preferences) {
                        await neo4jService.addOrUpdatePreference(
                            req.user.id,
                            prefType.toUpperCase(), // e.g., PREFERS_AIRLINE
                            pref.type, // e.g., Airline
                            pref.properties // e.g., { name: 'Emirates' }
                        );
                    }
                }
            }
        }

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: user.getPublicProfile()
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updateUserPreferences = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { preferences } = req.body;

        if (!preferences) {
            return res.status(400).json({ message: 'Preferences data is required.' });
        }

        await neo4jService.createUserNode(userId);

        for (const prefType in preferences) {
            const prefs = preferences[prefType];
            if (Array.isArray(prefs)) {
                for (const pref of prefs) {
                    await neo4jService.addOrUpdatePreference(
                        userId,
                        prefType.toUpperCase(),
                        pref.type,
                        pref.properties
                    );
                }
            }
        }

        res.status(200).json({
            status: 'success',
            message: 'User preferences updated successfully'
        });
    } catch (error) {
        console.error('Error updating user preferences:', error);
        next(error);
    }
};

// @desc    Get user preferences
// @route   GET /api/users/preferences
// @access  Private
const getUserPreferences = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const preferences = await neo4jService.getUserPreferences(userId);
        res.status(200).json({
            status: 'success',
            data: { preferences }
        });
    } catch (error) {
        console.error('Error retrieving user preferences:', error);
        next(error);
    }
};

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateProfile,
    updateUserPreferences,
    getUserPreferences
};
