const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('student'), createComplaint)
    .get(protect, getComplaints);

router.route('/:id')
    .get(protect, getComplaintById)
    .put(protect, authorize('faculty', 'admin'), updateComplaintStatus);

module.exports = router;
