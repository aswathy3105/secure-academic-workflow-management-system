const Request = require('../models/Request');

/**
 * @desc    Get all requests with filtering options
 * @route   GET /api/admin/requests
 * @access  Private (Admin only)
 */
const getAllRequests = async (req, res) => {
    try {
        const { studentId, status, startDate, endDate, requesterRole } = req.query;

        // Build filter object
        const filter = {};

        if (studentId) {
            filter.studentId = studentId;
        }

        if (requesterRole) {
            filter.requesterRole = requesterRole;
        }

        if (status) {
            filter.finalStatus = status;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }

        // Fetch requests with filters
        const requests = await Request.find(filter)
            .populate('studentId', 'name email role')
            .sort({ createdAt: -1 }); // Most recent first

        // Calculate statistics
        const stats = {
            total: requests.length,
            pending: requests.filter(r => r.finalStatus === 'pending').length,
            approved: requests.filter(r => r.finalStatus === 'approved').length,
            rejected: requests.filter(r => r.finalStatus === 'rejected').length,
            staffPending: requests.filter(r => r.requesterRole === 'student' && r.staffStatus === 'pending').length,
            hodPending: requests.filter(r =>
                (r.requesterRole === 'student' && r.staffStatus === 'approved' && r.hodStatus === 'pending') ||
                (r.requesterRole === 'staff' && r.hodStatus === 'pending')
            ).length
        };

        res.status(200).json({
            success: true,
            stats,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error('Get all requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching requests',
            error: error.message
        });
    }
};

module.exports = {
    getAllRequests
};
