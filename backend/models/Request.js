const mongoose = require('mongoose');

/**
 * Request Schema
 * Represents academic requests submitted by students
 * Stored permanently in the system with approval workflow status
 */
const requestSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student ID is required']
    },
    title: {
        type: String,
        required: [true, 'Please provide a request title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a request description'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    staffStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    hodStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    finalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    staffUpdatedAt: {
        type: Date
    },
    hodUpdatedAt: {
        type: Date
    }
});

/**
 * Index for efficient querying
 */
requestSchema.index({ studentId: 1, createdAt: -1 });
requestSchema.index({ staffStatus: 1 });
requestSchema.index({ hodStatus: 1, staffStatus: 1 });

module.exports = mongoose.model('Request', requestSchema);
