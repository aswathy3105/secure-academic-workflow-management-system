import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApprovedRequests, updateHODStatus } from '../services/api';

/**
 * HOD Dashboard Component
 * Displays requests that are either staff-approved (from students) or direct staff self-requests
 */
const HODDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await getApprovedRequests();
            if (response.success) {
                setRequests(response.requests);
            }
        } catch (error) {
            console.error('Error fetching HOD requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (requestId, status) => {
        setProcessingId(requestId);
        setMessage({ type: '', text: '' });

        try {
            const response = await updateHODStatus(requestId, status);
            if (response.success) {
                setMessage({
                    type: 'success',
                    text: `Request ${status} successfully!`
                });
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
                    <h1>HOD Dashboard</h1>
                    <p>Welcome, {user?.name}</p>
                </div>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </header>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <div className="card">
                <h2>Requests Pending Final Decision</h2>
                {loading ? (
                    <p>Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p className="no-data">No pending requests for approval.</p>
                ) : (
                    <div className="requests-grid">
                        {requests.map((request) => (
                            <div key={request._id} className="request-card">
                                <div className="request-header">
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <h3>{request.title}</h3>
                                        <span className={`badge badge-role-${request.requesterRole || 'student'}`} style={{
                                            fontSize: '0.75rem',
                                            width: 'fit-content',
                                            marginTop: '4px',
                                            textTransform: 'uppercase',
                                            backgroundColor: request.requesterRole === 'staff' ? '#dcfce7' : '#dbeafe',
                                            color: request.requesterRole === 'staff' ? '#166534' : '#1e40af',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {request.requesterRole || 'student'} Request
                                        </span>
                                    </div>
                                    <span className="request-date">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="request-body">
                                    <p><strong>From:</strong> {request.studentId?.name} ({request.studentId?.email})</p>
                                    <p><strong>Status:</strong> <span className="badge badge-approved">Staff Approved</span></p>
                                    <p><strong>Description:</strong></p>
                                    <p className="request-description">{request.description}</p>
                                </div>
                                <div className="request-actions">
                                    <button
                                        onClick={() => handleUpdateStatus(request._id, 'approved')}
                                        className="btn-approve"
                                        disabled={processingId === request._id}
                                    >
                                        {processingId === request._id ? 'Processing...' : 'Final Approve'}
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(request._id, 'rejected')}
                                        className="btn-reject"
                                        disabled={processingId === request._id}
                                    >
                                        {processingId === request._id ? 'Processing...' : 'Final Reject'}
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

export default HODDashboard;
