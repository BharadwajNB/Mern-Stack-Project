const Complaint = require('../models/Complaint');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority, isAnonymous } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        // Handle file uploads
        let attachments = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer);
                attachments.push({
                    filename: file.originalname,
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        }

        const complaint = await Complaint.create({
            student: req.user.id,
            title,
            description,
            category,
            priority: priority || 'Medium',
            isAnonymous: isAnonymous === 'true' || isAnonymous === true,
            attachments,
            history: [{
                action: 'Created',
                by: req.user.id,
                remark: 'Complaint filed'
            }]
        });

        res.status(201).json(complaint);
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all complaints (Role based filtering)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        let complaints;
        const populateOptions = [
            { path: 'assignedTo', select: 'name email' }
        ];

        if (req.user.role === 'student') {
            complaints = await Complaint.find({ student: req.user.id })
                .populate(populateOptions)
                .sort({ createdAt: -1 });
        } else if (req.user.role === 'faculty') {
            // Faculty sees complaints in their category or assigned to them
            complaints = await Complaint.find({})
                .populate([...populateOptions, { path: 'student', select: 'name email department' }])
                .sort({ createdAt: -1 });
        } else {
            // Admin sees all
            complaints = await Complaint.find({})
                .populate([...populateOptions, { path: 'student', select: 'name email department' }])
                .sort({ createdAt: -1 });
        }

        // Hide student info for anonymous complaints (except for the student themselves)
        const processed = complaints.map(c => {
            const obj = c.toObject();
            if (obj.isAnonymous && req.user.role !== 'student') {
                obj.student = { name: 'Anonymous', email: 'hidden' };
            }
            return obj;
        });

        res.status(200).json(processed);
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
            .populate('student', 'name email')
            .populate('assignedTo', 'name email')
            .populate('comments.user', 'name email role')
            .populate('history.by', 'name');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Access Control
        if (req.user.role === 'student' && complaint.student._id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const obj = complaint.toObject();
        // Hide student info for anonymous complaints (except for the student themselves)
        if (obj.isAnonymous && req.user.role !== 'student') {
            obj.student = { name: 'Anonymous', email: 'hidden' };
        }

        res.status(200).json(obj);
    } catch (error) {
        console.error('Get complaint by id error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (Faculty/Admin)
const updateComplaintStatus = async (req, res) => {
    try {
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
            complaint.assignedTo = req.user.id;
        }

        complaint.history.push({
            action: `Status changed to ${status}`,
            by: req.user.id,
            remark: remark || ''
        });

        await complaint.save();

        const updated = await Complaint.findById(req.params.id)
            .populate('student', 'name email')
            .populate('assignedTo', 'name email')
            .populate('comments.user', 'name email role');

        res.status(200).json(updated);
    } catch (error) {
        console.error('Update complaint status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add comment to complaint
// @route   POST /api/complaints/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Comment message is required' });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Access control: student can only comment on their own complaints
        if (req.user.role === 'student' && complaint.student.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        complaint.comments.push({
            user: req.user.id,
            message
        });

        complaint.history.push({
            action: 'Comment added',
            by: req.user.id,
            remark: message.substring(0, 50)
        });

        await complaint.save();

        const updated = await Complaint.findById(req.params.id)
            .populate('comments.user', 'name email role');

        res.status(200).json(updated);
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Rate a resolved complaint
// @route   POST /api/complaints/:id/rate
// @access  Private (Student only, own complaint)
const rateComplaint = async (req, res) => {
    try {
        const { score, feedback } = req.body;

        if (!score || score < 1 || score > 5) {
            return res.status(400).json({ message: 'Rating score must be between 1 and 5' });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Only the student who filed can rate
        if (complaint.student.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Only resolved complaints can be rated
        if (complaint.status !== 'Resolved') {
            return res.status(400).json({ message: 'Only resolved complaints can be rated' });
        }

        // Prevent re-rating
        if (complaint.rating && complaint.rating.score) {
            return res.status(400).json({ message: 'Complaint already rated' });
        }

        complaint.rating = {
            score,
            feedback: feedback || '',
            ratedAt: new Date()
        };

        complaint.history.push({
            action: `Rated ${score}/5 stars`,
            by: req.user.id,
            remark: feedback || ''
        });

        await complaint.save();
        res.status(200).json(complaint);
    } catch (error) {
        console.error('Rate complaint error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    addComment,
    rateComplaint
};
