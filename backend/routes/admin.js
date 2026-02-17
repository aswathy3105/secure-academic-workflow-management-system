const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { getAllRequests } = require('../controllers/adminController');

/**
 * @route   GET /api/admin/requests
 * @desc    Get all requests with filtering options
 * @access  Private (Admin only)
 * @query   studentId, status, startDate, endDate
 */
router.get('/requests', auth, roleAuth('admin'), getAllRequests);

module.exports = router;
