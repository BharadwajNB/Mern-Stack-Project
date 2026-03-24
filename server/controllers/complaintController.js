const Complaint = require('../models/Complaint');
const path = require('path');
const fs = require('fs');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const complaint = await Complaint.create({
            createdBy: req.user.id,
            title,
            description,
            category,
            priority: priority || 'Medium',
            fileUrl: req.file ? `/uploads/${req.file.filename}` : null
        });

        res.status(201).json(complaint);
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Access Control: Admin or Owner only
        if (req.user.role !== 'admin' && complaint.createdBy._id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(complaint);
    } catch (error) {
        console.error('Get complaint by id error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Download file
// @route   GET /api/complaints/download/:filename
// @access  Private (Admin or Owner only)
const downloadFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Find associated complaint to check permissions
        const complaint = await Complaint.findOne({ fileUrl: `/uploads/${filename}` });
        
        if (!complaint) {
            return res.status(404).json({ message: 'File record not found' });
        }

        // Permission check: Owner or Admin
        if (req.user.role !== 'admin' && complaint.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.download(filePath);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    downloadFile
};
