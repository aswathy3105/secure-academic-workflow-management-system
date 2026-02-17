import { Navigate } from 'react-router-dom';

/**
 * Protected Route Component
 * Checks authentication and role-based authorization
 */
const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user is authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has the required role
    if (allowedRole && user.role !== allowedRole) {
        // Redirect to appropriate dashboard based on user's actual role
        const roleRoutes = {
            student: '/student',
            staff: '/staff',
            hod: '/hod',
            admin: '/admin'
        };
        return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
    }

    return children;
};

export default ProtectedRoute;
