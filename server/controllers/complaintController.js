const Complaint = require('../models/Complaint');
const path = require('path');
const fs = require('fs');

// ────────────────────────────────────────────────────────────────────
// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
// ────────────────────────────────────────────────────────────────────
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        let fileUrl = null;
        let fileName = null;

        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
            fileName = req.file.originalname;
        }

        const complaint = await Complaint.create({
            createdBy: req.user.id,
            title,
            description,
            category,
            priority: priority || 'Medium',
            fileUrl,
            fileName
        });

        res.status(201).json(complaint);
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ message: 'Server error creating complaint' });
    }
};

// ────────────────────────────────────────────────────────────────────
// @desc    Get complaints — Admin sees ALL, Student sees OWN
// @route   GET /api/complaints
// @access  Private
// ────────────────────────────────────────────────────────────────────
const getComplaints = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { createdBy: req.user.id };

        const complaints = await Complaint.find(filter)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ message: 'Server error fetching complaints' });
    }
};

// ────────────────────────────────────────────────────────────────────
// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private (Admin or Owner)
// ────────────────────────────────────────────────────────────────────
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (req.user.role !== 'admin' && complaint.createdBy._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }

        res.status(200).json(complaint);
    } catch (error) {
        console.error('Get complaint by id error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ────────────────────────────────────────────────────────────────────
// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (Admin only)
// ────────────────────────────────────────────────────────────────────
const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('createdBy', 'name email');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json(complaint);
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};

// ────────────────────────────────────────────────────────────────────
// @desc    Download an attached file
// @route   GET /api/complaints/download/:filename
// @access  Public (filenames are timestamp-hashed, unguessable)
// ────────────────────────────────────────────────────────────────────
const downloadFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(filePath);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Server error downloading file' });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    downloadFile
};
