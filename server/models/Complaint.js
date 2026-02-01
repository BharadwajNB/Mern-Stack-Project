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
        enum: ['Academic', 'Infrastructure', 'Mess', 'Hostel', 'Library', 'Other']
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    attachments: [{
        filename: String,
        url: String,
        publicId: String // Cloudinary public ID for deletion
    }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dueDate: {
        type: Date
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    rating: {
        score: {
            type: Number,
            min: 1,
            max: 5
        },
        feedback: String,
        ratedAt: Date
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

// Set due date based on priority before saving
complaintSchema.pre('save', function (next) {
    if (this.isNew && !this.dueDate) {
        const daysMap = { 'Urgent': 1, 'High': 3, 'Medium': 7, 'Low': 14 };
        const days = daysMap[this.priority] || 7;
        this.dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
    next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;

