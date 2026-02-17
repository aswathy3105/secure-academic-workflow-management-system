const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { getPendingRequests, updateRequestStatus } = require('../controllers/staffController');

/**
 * @route   GET /api/staff/requests
 * @desc    Get all pending requests (staffStatus = pending)
 * @access  Private (Staff only)
 */
router.get('/requests', auth, roleAuth('staff'), getPendingRequests);

/**
 * @route   PUT /api/staff/request/:id
 * @desc    Approve or reject a request
 * @access  Private (Staff only)
 */
router.put('/request/:id', auth, roleAuth('staff'), updateRequestStatus);

module.exports = router;
