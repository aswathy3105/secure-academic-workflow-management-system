import axios from 'axios';

/**
 * Axios instance with base URL configuration
 */
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Request interceptor to attach JWT token to all requests
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle errors globally
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================
// Authentication APIs
// ============================================

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
};

// ============================================
// Student APIs
// ============================================

export const submitRequest = async (title, description) => {
    const response = await api.post('/student/request', { title, description });
    return response.data;
};

export const getMyRequests = async () => {
    const response = await api.get('/student/requests');
    return response.data;
};

// ============================================
// Staff APIs
// ============================================

export const getPendingRequests = async () => {
    const response = await api.get('/staff/requests');
    return response.data;
};

export const updateStaffStatus = async (requestId, status) => {
    const response = await api.put(`/staff/request/${requestId}`, { status });
    return response.data;
};

export const submitStaffRequest = async (title, description) => {
    const response = await api.post('/staff/request', { title, description });
    return response.data;
};

export const getStaffMyRequests = async () => {
    const response = await api.get('/staff/my-requests');
    return response.data;
};

// ============================================
// HOD APIs
// ============================================

export const getApprovedRequests = async () => {
    const response = await api.get('/hod/requests');
    return response.data;
};

export const updateHODStatus = async (requestId, status) => {
    const response = await api.put(`/hod/request/${requestId}`, { status });
    return response.data;
};

// ============================================
// Admin APIs
// ============================================

export const getAllRequests = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.studentId) params.append('studentId', filters.studentId);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.requesterRole) params.append('requesterRole', filters.requesterRole);

    const response = await api.get(`/admin/requests?${params.toString()}`);
    return response.data;
};

export default api;
