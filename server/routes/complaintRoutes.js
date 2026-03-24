const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    downloadFile
} = require('../controllers/complaintController');
const {
    getAllComplaints,
    updateComplaintStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

// --- Standard Student/Private Routes ---

router.route('/')
    .post(protect, authorize('student'), upload.single('file'), createComplaint)
    .get(protect, getComplaints);

router.get('/download/:filename', protect, downloadFile);

router.route('/:id')
    .get(protect, getComplaintById);

// --- Admin Only Routes ---

router.route('/admin/all')
    .get(protect, authorize('admin'), getAllComplaints);

router.route('/admin/:id')
    .put(protect, authorize('admin'), updateComplaintStatus);

module.exports = router;
