const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');
const { Parser } = require('json2csv');

// @desc    Export complaints as CSV
// @route   GET /api/exports/complaints
// @access  Private/Admin
router.get('/complaints', protect, authorize('admin'), async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('createdBy', 'name email studentId section');
        
        const fields = [
            { label: 'ID', value: '_id' },
            { label: 'Student Name', value: 'createdBy.name' },
            { label: 'Student ID', value: 'createdBy.studentId' },
            { label: 'Section', value: 'createdBy.section' },
            { label: 'Title', value: 'title' },
            { label: 'Category', value: 'category' },
            { label: 'Priority', value: 'priority' },
            { label: 'Status', value: 'status' },
            { label: 'Created At', value: 'createdAt' }
        ];
        
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(complaints);
        
        res.header('Content-Type', 'text/csv');
        res.attachment(`complaints_report_${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Export statistics for HOD review (Most reported issues)
// @route   GET /api/exports/issues
// @access  Private/Admin
router.get('/issues', protect, authorize('admin'), async (req, res) => {
    try {
        const stats = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        const fields = [
            { label: 'Category', value: '_id' },
            { label: 'Total Complaints', value: count }
        ];

        // This is simple so we can manually build it if needed or use json2csv
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(stats);
        
        res.header('Content-Type', 'text/csv');
        res.attachment(`issue_stats_${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
