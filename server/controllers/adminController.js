const Complaint = require('../models/Complaint');

// @desc    Get all complaints (Admin)
// @route   GET /api/admin/complaints
// @access  Private (Admin only)
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({})
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        console.error('Get all complaints error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update complaint status (Admin)
// @route   PUT /api/admin/complaints/:id
// @access  Private (Admin only)
const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
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
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllComplaints,
    updateComplaintStatus
};
