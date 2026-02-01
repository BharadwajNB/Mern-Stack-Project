const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    addComment,
    rateComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Complaint CRUD routes
router.route('/')
    .post(protect, authorize('student'), upload.array('attachments', 5), createComplaint)
    .get(protect, getComplaints);

router.route('/:id')
    .get(protect, getComplaintById)
    .put(protect, authorize('faculty', 'admin'), updateComplaintStatus);

// Comment route
router.post('/:id/comment', protect, addComment);

// Rating route (student only)
router.post('/:id/rate', protect, authorize('student'), rateComplaint);

module.exports = router;
