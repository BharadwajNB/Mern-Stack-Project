const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    downloadFile
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

// ─── Public ──────────────────────────────────────────────────────
// Download uses timestamp-hashed filenames (unguessable)
router.get('/download/:filename', downloadFile);

// ─── Private (Any authenticated user) ───────────────────────────
// POST  → Student creates a complaint (with optional file upload)
// GET   → Admin sees ALL, Student sees OWN
router.route('/')
    .post(protect, authorize('student'), upload.single('file'), createComplaint)
    .get(protect, getComplaints);

// GET   → Single complaint (Admin or Owner)
// PUT   → Admin updates status
router.route('/:id')
    .get(protect, getComplaintById)
    .put(protect, authorize('admin'), updateComplaintStatus);

module.exports = router;
