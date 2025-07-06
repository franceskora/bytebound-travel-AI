const express = require('express');
const router = express.Router();
const { getPartnerAnalytics } = require('../controllers/partnerAnalyticsController');
const { protect, authorize } = require('../middleware/auth');

// All partner routes require a logged-in user with the 'partner' role
router.use(protect, authorize('partner'));

router.get('/analytics', getPartnerAnalytics);

module.exports = router;