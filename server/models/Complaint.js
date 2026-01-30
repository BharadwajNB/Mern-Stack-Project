const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Academic', 'Infrastructure', 'Mess', 'Other']
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Faculty ID
    },
    history: [{
        action: String,
        by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        },
        remark: String
    }]
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
