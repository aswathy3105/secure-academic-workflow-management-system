const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { getApprovedRequests, updateRequestStatus } = require('../controllers/hodController');

/**
 * @route   GET /api/hod/requests
 * @desc    Get staff-approved requests pending HOD approval
 * @access  Private (HOD only)
 */
router.get('/requests', auth, roleAuth('hod'), getApprovedRequests);

/**
 * @route   PUT /api/hod/request/:id
 * @desc    Final approval or rejection by HOD
 * @access  Private (HOD only)
 */
router.put('/request/:id', auth, roleAuth('hod'), updateRequestStatus);

module.exports = router;
