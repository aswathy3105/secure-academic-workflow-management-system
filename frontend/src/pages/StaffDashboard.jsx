import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingRequests, updateStaffStatus } from '../services/api';

/**
 * Staff Dashboard Component
 * Displays pending requests for staff approval
 */
const StaffDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await getPendingRequests();
            if (response.success) {
                setRequests(response.requests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (requestId, status) => {
        setProcessingId(requestId);
        setMessage({ type: '', text: '' });

        try {
            const response = await updateStaffStatus(requestId, status);
            if (response.success) {
                setMessage({
                    type: 'success',
                    text: `Request ${status} successfully!`
                });
                // Remove the processed request from the list
                setRequests(requests.filter(req => req._id !== requestId));
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update request'
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Staff Dashboard</h1>
                    <p>Welcome, {user?.name}</p>
                </div>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </header>

            {/* Statistics */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{requests.length}</h3>
                    <p>Pending Requests</p>
                </div>
            </div>

            {/* Pending Requests */}
            <div className="card">
                <h2>Pending Requests for Approval</h2>
                {message.text && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}
                {loading ? (
                    <p>Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p className="no-data">No pending requests at this time.</p>
                ) : (
                    <div className="requests-grid">
                        {requests.map((request) => (
                            <div key={request._id} className="request-card">
                                <div className="request-header">
                                    <h3>{request.title}</h3>
                                    <span className="request-date">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="request-body">
                                    <p><strong>Student:</strong> {request.studentId?.name} ({request.studentId?.email})</p>
                                    <p><strong>Description:</strong></p>
                                    <p className="request-description">{request.description}</p>
                                </div>
                                <div className="request-actions">
                                    <button
                                        onClick={() => handleUpdateStatus(request._id, 'approved')}
                                        className="btn-approve"
                                        disabled={processingId === request._id}
                                    >
                                        {processingId === request._id ? 'Processing...' : 'Approve'}
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(request._id, 'rejected')}
                                        className="btn-reject"
                                        disabled={processingId === request._id}
                                    >
                                        {processingId === request._id ? 'Processing...' : 'Reject'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;
