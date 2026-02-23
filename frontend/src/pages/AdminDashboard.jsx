import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRequests } from '../services/api';

/**
 * Admin Dashboard Component
 * View all requests with filtering by role, status, and date
 */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        status: '',
        requesterRole: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        fetchData();
    }, []);

    const fetchData = async (currentFilters = filters) => {
        setLoading(true);
        try {
            const response = await getAllRequests(currentFilters);
            if (response.success) {
                setRequests(response.requests);
                setStats(response.stats);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        setFilters(newFilters);
    };

    const applyFilters = (e) => {
        e.preventDefault();
        fetchData();
    };

    const resetFilters = () => {
        const defaultFilters = {
            status: '',
            requesterRole: '',
            startDate: '',
            endDate: ''
        };
        setFilters(defaultFilters);
        fetchData(defaultFilters);
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
        <div className="dashboard-container" style={{ maxWidth: '1200px' }}>
            <header className="dashboard-header">
                <div>
                    <h1>Admin Control Panel</h1>
                    <p>System Overview & Request Monitoring</p>
                </div>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </header>

            {/* Statistics Cards */}
            {stats && (
                <div className="stats-container">
                    <div className="stat-card">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Requests</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value text-pending">{stats.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value text-approved">{stats.approved}</span>
                        <span className="stat-label">Approved</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value text-rejected">{stats.rejected}</span>
                        <span className="stat-label">Rejected</span>
                    </div>
                </div>
            )}

            {/* Filters Section */}
            <div className="card filter-card" style={{ marginBottom: '25px' }}>
                <h3>Filter Requests</h3>
                <form onSubmit={applyFilters} className="filter-form">
                    <div className="filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                        <div className="form-group">
                            <label>Role</label>
                            <select name="requesterRole" value={filters.requesterRole} onChange={handleFilterChange}>
                                <option value="">All Roles</option>
                                <option value="student">Student</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>From Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>To Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                    <div className="filter-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn-primary">Apply Filters</button>
                        <button type="button" onClick={resetFilters} className="btn-secondary">Reset</button>
                    </div>
                </form>
            </div>

            {/* Requests Table */}
            <div className="card">
                <h2>System Requests</h2>
                {loading ? (
                    <p>Loading system data...</p>
                ) : requests.length === 0 ? (
                    <p className="no-data">No requests matching the selected filters.</p>
                ) : (
                    <div className="table-container">
                        <table className="requests-table">
                            <thead>
                                <tr>
                                    <th>Requester</th>
                                    <th>Role</th>
                                    <th>Title</th>
                                    <th>Staff Status</th>
                                    <th>HOD Status</th>
                                    <th>Final</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req._id}>
                                        <td>
                                            <div className="user-info">
                                                <span className="user-name">{req.studentId?.name || 'Unknown'}</span>
                                                <span className="user-email">{req.studentId?.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                textTransform: 'capitalize',
                                                fontWeight: '600',
                                                color: req.requesterRole === 'staff' ? '#059669' : '#2563eb'
                                            }}>
                                                {req.requesterRole}
                                            </span>
                                        </td>
                                        <td>{req.title}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(req.staffStatus)}`}>
                                                {req.staffStatus}
                                            </span>
                                        </td>
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
    );
};

export default AdminDashboard;
