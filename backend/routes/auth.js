const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('role')
            .optional()
            .isIn(['admin', 'student', 'staff', 'hod'])
            .withMessage('Invalid role')
    ],
    register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    login
);

module.exports = router;
