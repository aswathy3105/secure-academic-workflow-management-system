import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import HODDashboard from './pages/HODDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main App Component
 * Handles routing and role-based access control
 */
function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes - Student */}
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Staff */}
                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute allowedRole="staff">
                            <StaffDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - HOD */}
                <Route
                    path="/hod"
                    element={
                        <ProtectedRoute allowedRole="hod">
                            <HODDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes - Admin */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
