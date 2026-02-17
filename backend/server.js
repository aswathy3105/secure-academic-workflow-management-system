require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const staffRoutes = require('./routes/staff');
const hodRoutes = require('./routes/hod');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✓ MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('✗ MongoDB connection error:', err.message);
        process.exit(1);
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Secure Academic Workflow Authorization System API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            student: '/api/student',
            staff: '/api/staff',
            hod: '/api/hod',
            admin: '/api/admin'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
