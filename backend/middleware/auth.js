const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request object
 */
const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            });
        }

        // Extract token (remove 'Bearer ' prefix)
        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from token payload
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found, authorization denied'
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
};

module.exports = auth;
