import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRequests } from '../services/api';

/**
 * Admin Dashboard Component
 * Displays all requests with filtering and comprehensive statistics
 */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({});
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        fetchRequests();
    }, []);

    const fetchRequests = async (appliedFilters = {}) => {
        setLoading(true);
        try {
            const response = await getAllRequests(appliedFilters);
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

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleApplyFilters = () => {
        const appliedFilters = {};
        if (filters.status) appliedFilters.status = filters.status;
        if (filters.startDate) appliedFilters.startDate = filters.startDate;
        if (filters.endDate) appliedFilters.endDate = filters.endDate;
        fetchRequests(appliedFilters);
    };

    const handleClearFilters = () => {
        setFilters({ status: '', startDate: '', endDate: '' });
        fetchRequests();
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
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {user?.name}</p>
                </div>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </header>

            {/* Statistics Cards */}
            <div className="stats-grid admin-stats">
                <div className="stat-card">
                    <h3>{stats.total || 0}</h3>
                    <p>Total Requests</p>
                </div>
                <div className="stat-card stat-pending">
                    <h3>{stats.pending || 0}</h3>
                    <p>Pending Final</p>
                </div>
                <div className="stat-card stat-approved">
                    <h3>{stats.approved || 0}</h3>
                    <p>Approved</p>
                </div>
                <div className="stat-card stat-rejected">
                    <h3>{stats.rejected || 0}</h3>
                    <p>Rejected</p>
                </div>
                <div className="stat-card stat-info">
                    <h3>{stats.staffPending || 0}</h3>
                    <p>Awaiting Staff</p>
                </div>
                <div className="stat-card stat-info">
                    <h3>{stats.hodPending || 0}</h3>
                    <p>Awaiting HOD</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <h2>Filter Requests</h2>
                <div className="filter-grid">
                    <div className="form-group">
                        <label htmlFor="status">Final Status</label>
                        <select
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="filter-actions">
                    <button onClick={handleApplyFilters} className="btn-primary">
                        Apply Filters
                    </button>
                    <button onClick={handleClearFilters} className="btn-secondary">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* All Requests */}
            <div className="card">
                <h2>All Requests ({requests.length})</h2>
                {loading ? (
                    <p>Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p className="no-data">No requests found.</p>
                ) : (
                    <div className="table-container">
                        <table className="requests-table admin-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
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
                                        <td>
                                            <div className="student-info">
                                                <strong>{request.studentId?.name}</strong>
                                                <small>{request.studentId?.email}</small>
                                            </div>
                                        </td>
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

export default AdminDashboard;
