const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { submitRequest, getMyRequests } = require('../controllers/studentController');

/**
 * @route   POST /api/student/request
 * @desc    Submit a new request
 * @access  Private (Student only)
 */
router.post(
    '/request',
    auth,
    roleAuth('student'),
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ max: 200 })
            .withMessage('Title cannot exceed 200 characters'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Description is required')
            .isLength({ max: 1000 })
            .withMessage('Description cannot exceed 1000 characters')
    ],
    submitRequest
);

/**
 * @route   GET /api/student/requests
 * @desc    Get all requests for logged-in student
 * @access  Private (Student only)
 */
router.get('/requests', auth, roleAuth('student'), getMyRequests);

module.exports = router;
