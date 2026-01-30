const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    const complaint = await Complaint.create({
        student: req.user.id,
        title,
        description,
        category,
        priority: priority || 'Medium',
        history: [{
            action: 'Created',
            by: req.user.id,
            remark: 'Complaint filed'
        }]
    });

    res.status(201).json(complaint);
};

// @desc    Get all complaints (Role based filtering)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    let complaints;

    if (req.user.role === 'student') {
        complaints = await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 });
    } else if (req.user.role === 'faculty') {
        // Faculty sees complaints assigned to them or in their department (Simplified to ALL for now or matching category if we mapped category->dept)
        // For this version: Faculty sees ALL complaints to pick from/manage, or strictly assigned. user assumption: Dept level.
        // Assuming 'category' maps to Dept. We'll simply show ALL for Faculty for now to ensure visibility, or filter by category if user has department.
        complaints = await Complaint.find({}).sort({ createdAt: -1 });
        // TODO: Refine filter based on Dept matching if needed.
    } else {
        // Admin sees all
        complaints = await Complaint.find({}).populate('student', 'name email').sort({ createdAt: -1 });
    }

    res.status(200).json(complaints);
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    const complaint = await Complaint.findById(req.params.id)
        .populate('student', 'name email')
        .populate('assignedTo', 'name email');

    if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
    }

    // Access Control
    if (req.user.role === 'student' && complaint.student._id.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(complaint);
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (Faculty/Admin)
const updateComplaintStatus = async (req, res) => {
    const { status, remark } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role === 'student') {
        return res.status(403).json({ message: 'Students cannot update status' });
    }

    complaint.status = status || complaint.status;
    if (req.user.role === 'faculty' && !complaint.assignedTo) {
        complaint.assignedTo = req.user.id; // Auto-assign if faculty interacts
    }

    complaint.history.push({
        action: `Status Updated to ${status}`,
        by: req.user.id,
        remark: remark || ''
    });

    await complaint.save();
    res.status(200).json(complaint);
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus
};
