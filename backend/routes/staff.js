const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const {
    getPendingRequests,
    updateRequestStatus,
    submitMyRequest,
    getMyRequests
} = require('../controllers/staffController');

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

/**
 * @route   POST /api/staff/request
 * @desc    Submit own staff request
 * @access  Private (Staff only)
 */
router.post('/request', auth, roleAuth('staff'), submitMyRequest);

/**
 * @route   GET /api/staff/my-requests
 * @desc    Get own submitted requests
 * @access  Private (Staff only)
 */
router.get('/my-requests', auth, roleAuth('staff'), getMyRequests);

module.exports = router;
