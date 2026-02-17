const Request = require('../models/Request');
const { validationResult } = require('express-validator');

/**
 * @desc    Submit a new request
 * @route   POST /api/student/request
 * @access  Private (Student only)
 */
const submitRequest = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { title, description } = req.body;

        // Create request with authenticated student's ID
        const request = await Request.create({
            studentId: req.user._id,
            title,
            description,
            staffStatus: 'pending',
            hodStatus: 'pending',
            finalStatus: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Request submitted successfully',
            request
        });
    } catch (error) {
        console.error('Submit request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting request',
            error: error.message
        });
    }
};

/**
 * @desc    Get all requests for logged-in student
 * @route   GET /api/student/requests
 * @access  Private (Student only)
 */
const getMyRequests = async (req, res) => {
    try {
        // Fetch all requests for the authenticated student
        const requests = await Request.find({ studentId: req.user._id })
            .sort({ createdAt: -1 }); // Most recent first

        // Calculate statistics
        const stats = {
            total: requests.length,
            pending: requests.filter(r => r.finalStatus === 'pending').length,
            approved: requests.filter(r => r.finalStatus === 'approved').length,
            rejected: requests.filter(r => r.finalStatus === 'rejected').length
        };

        res.status(200).json({
            success: true,
            stats,
            requests
        });
    } catch (error) {
        console.error('Get my requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching requests',
            error: error.message
        });
    }
};

module.exports = {
    submitRequest,
    getMyRequests
};
