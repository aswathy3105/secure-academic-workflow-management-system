/**
 * Role-Based Authorization Middleware
 * Checks if authenticated user has required role(s)
 * Must be used after auth middleware
 */
const roleAuth = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user exists (should be set by auth middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if user's role is in allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
            });
        }

        // User has required role, proceed
        next();
    };
};

module.exports = roleAuth;
