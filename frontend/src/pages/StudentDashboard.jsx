import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitRequest, getMyRequests } from '../services/api';

/**
 * Student Dashboard Component
 * Displays request statistics, submission form, and request history
 */
const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await getMyRequests();
            if (response.success) {
                setStats(response.stats);
                setRequests(response.requests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await submitRequest(formData.title, formData.description);
            if (response.success) {
                setMessage({ type: 'success', text: 'Request submitted successfully!' });
                setFormData({ title: '', description: '' });
                fetchRequests(); // Refresh the list
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to submit request'
            });
        } finally {
            setSubmitting(false);
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
                    <h1>Student Dashboard</h1>
                    <p>Welcome, {user?.name}</p>
                </div>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </header>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{stats.total}</h3>
                    <p>Total Requests</p>
                </div>
                <div className="stat-card stat-pending">
                    <h3>{stats.pending}</h3>
                    <p>Pending</p>
                </div>
                <div className="stat-card stat-approved">
                    <h3>{stats.approved}</h3>
                    <p>Approved</p>
                </div>
                <div className="stat-card stat-rejected">
                    <h3>{stats.rejected}</h3>
                    <p>Rejected</p>
                </div>
            </div>

            {/* Submit Request Form */}
            <div className="card">
                <h2>Submit New Request</h2>
                {message.text && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}
                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-group">
                        <label htmlFor="title">Request Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength="200"
                            placeholder="Enter request title"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            maxLength="1000"
                            rows="4"
                            placeholder="Describe your request in detail"
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>

            {/* Requests List */}
            <div className="card">
                <h2>My Requests</h2>
                {loading ? (
                    <p>Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p className="no-data">No requests submitted yet.</p>
                ) : (
                    <div className="table-container">
                        <table className="requests-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Staff Status</th>
                                    <th>HOD Status</th>
                                    <th>Final Status</th>
                                    <th>Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request._id}>
                                        <td>{request.title}</td>
                                        <td className="description-cell">{request.description}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(request.staffStatus)}`}>
                                                {request.staffStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(request.hodStatus)}`}>
                                                {request.hodStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(request.finalStatus)}`}>
                                                {request.finalStatus}
                                            </span>
                                        </td>
                                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
