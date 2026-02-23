const Request = require('../models/Request');

/**
 * @desc    Get staff-approved requests pending HOD approval
 * @route   GET /api/hod/requests
 * @access  Private (HOD only)
 */
const getApprovedRequests = async (req, res) => {
    try {
        // Fetch requests where:
        // 1. Student request that is staff-approved AND HOD pending
        // 2. Staff self-request that is HOD pending
        const requests = await Request.find({
            $or: [
                { requesterRole: 'student', staffStatus: 'approved', hodStatus: 'pending' },
                { requesterRole: 'staff', hodStatus: 'pending' }
            ]
        })
            .populate('studentId', 'name email role')
            .sort({ createdAt: -1 }); // Most recent first

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error('Get approved requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching approved requests',
            error: error.message
        });
    }
};

/**
 * @desc    Final approval/rejection by HOD
 * @route   PUT /api/hod/request/:id
 * @access  Private (HOD only)
 */
const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "approved" or "rejected"'
            });
        }

        // Find request
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Verify request is staff-approved
        if (request.staffStatus !== 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Request must be approved by staff first'
            });
        }

        // Check if HOD already processed this request
        if (request.hodStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request has already been processed by HOD'
            });
        }

        // Update HOD status and final status
        request.hodStatus = status;
        request.finalStatus = status; // Final status matches HOD decision
        request.hodUpdatedAt = Date.now();

        await request.save();

        res.status(200).json({
            success: true,
            message: `Request ${status} successfully by HOD`,
            request
        });
    } catch (error) {
        console.error('Update request status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating request status',
            error: error.message
        });
    }
};

module.exports = {
    getApprovedRequests,
    updateRequestStatus
};
