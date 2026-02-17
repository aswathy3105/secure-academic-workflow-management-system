const Request = require('../models/Request');

/**
 * @desc    Get all pending requests (staffStatus = pending)
 * @route   GET /api/staff/requests
 * @access  Private (Staff only)
 */
const getPendingRequests = async (req, res) => {
    try {
        // Fetch requests where staff approval is pending
        const requests = await Request.find({ staffStatus: 'pending' })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 }); // Most recent first

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error('Get pending requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending requests',
            error: error.message
        });
    }
};

/**
 * @desc    Update request status (approve or reject)
 * @route   PUT /api/staff/request/:id
 * @access  Private (Staff only)
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

        // Check if request is still pending
        if (request.staffStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request has already been processed by staff'
            });
        }

        // Update staff status
        request.staffStatus = status;
        request.staffUpdatedAt = Date.now();

        // If staff rejects, update final status to rejected
        if (status === 'rejected') {
            request.finalStatus = 'rejected';
        }

        await request.save();

        res.status(200).json({
            success: true,
            message: `Request ${status} successfully`,
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
    getPendingRequests,
    updateRequestStatus
};
