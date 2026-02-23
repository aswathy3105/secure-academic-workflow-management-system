import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getPendingRequests,
    updateStaffStatus,
    submitStaffRequest,
    getStaffMyRequests
} from '../services/api';

/**
 * Staff Dashboard Component
 * Displays pending requests for staff approval AND staff's own requests
 */
const StaffDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' or 'my-requests'

    // State for Student Approvals
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loadingApprovals, setLoadingApprovals] = useState(true);

    // State for My Requests
    const [myRequests, setMyRequests] = useState([]);
    const [loadingMyRequests, setLoadingMyRequests] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });

    const [processingId, setProcessingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        fetchApprovals();
    }, []);

    const fetchApprovals = async () => {
        setLoadingApprovals(true);
        try {
            const response = await getPendingRequests();
            if (response.success) {
                setPendingRequests(response.requests);
            }
        } catch (error) {
            console.error('Error fetching approvals:', error);
        } finally {
            setLoadingApprovals(false);
        }
    };

    const fetchMyRequests = async () => {
        setLoadingMyRequests(true);
        try {
            const response = await getStaffMyRequests();
            if (response.success) {
                setMyRequests(response.requests);
            }
        } catch (error) {
            console.error('Error fetching my requests:', error);
        } finally {
            setLoadingMyRequests(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMessage({ type: '', text: '' });
        if (tab === 'my-requests') {
            fetchMyRequests();
        } else {
            fetchApprovals();
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
                setPendingRequests(pendingRequests.filter(req => req._id !== requestId));
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

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await submitStaffRequest(formData.title, formData.description);
            if (response.success) {
                setMessage({ type: 'success', text: 'Your request has been submitted to HOD' });
                setFormData({ title: '', description: '' });
                fetchMyRequests();
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to submit request'
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-pending',
            approved: 'badge-approved',
            rejected: 'badge-rejected'
        };
        return badges[status] || 'badge-pending';
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

            {/* Tab Navigation */}
            <div className="tab-navigation" style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <button
                    onClick={() => handleTabChange('approvals')}
                    className={`tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'approvals' ? '3px solid #2563eb' : 'none',
                        color: activeTab === 'approvals' ? '#2563eb' : '#64748b',
                        fontWeight: activeTab === 'approvals' ? '600' : '400'
                    }}
                >
                    Student Approvals
                </button>
                <button
                    onClick={() => handleTabChange('my-requests')}
                    className={`tab-btn ${activeTab === 'my-requests' ? 'active' : ''}`}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'my-requests' ? '3px solid #2563eb' : 'none',
                        color: activeTab === 'my-requests' ? '#2563eb' : '#64748b',
                        fontWeight: activeTab === 'my-requests' ? '600' : '400'
                    }}
                >
                    My Requests
                </button>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            {activeTab === 'approvals' ? (
                <div className="card">
                    <h2>Student Requests Pending Approval</h2>
                    {loadingApprovals ? (
                        <p>Loading requests...</p>
                    ) : pendingRequests.length === 0 ? (
                        <p className="no-data">No pending student requests at this time.</p>
                    ) : (
                        <div className="requests-grid">
                            {pendingRequests.map((request) => (
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
            ) : (
                <div className="my-requests-section">
                    <div className="card">
                        <h2>Submit New Staff Request</h2>
                        <form onSubmit={handleFormSubmit} className="request-form">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Leave request, Academic grant, etc."
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    required
                                    rows="4"
                                    placeholder="Details of your request"
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={formLoading}>
                                {formLoading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h2>My Submitted Requests</h2>
                        {loadingMyRequests ? (
                            <p>Loading your requests...</p>
                        ) : myRequests.length === 0 ? (
                            <p className="no-data">You haven't submitted any requests yet.</p>
                        ) : (
                            <div className="table-container">
                                <table className="requests-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Status (HOD)</th>
                                            <th>Final Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myRequests.map((req) => (
                                            <tr key={req._id}>
                                                <td>{req.title}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(req.hodStatus)}`}>
                                                        {req.hodStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(req.finalStatus)}`}>
                                                        {req.finalStatus}
                                                    </span>
                                                </td>
                                                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;
