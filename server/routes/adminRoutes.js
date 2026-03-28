const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// Multer setup for CSV uploads
const upload = multer({ dest: 'uploads/' });

// @desc    Get all students grouped by section
// @route   GET /api/admin/students
// @access  Private/Admin
router.get('/students', protect, authorize('admin'), async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).sort({ section: 1, name: 1 });
        
        // Group by section
        const grouped = students.reduce((acc, student) => {
            const section = student.section || 'Unassigned';
            if (!acc[section]) acc[section] = [];
            acc[section].push(student);
            return acc;
        }, {});

        res.json(grouped);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Register a single student
// @route   POST /api/admin/student
// @access  Private/Admin
router.post('/student', protect, authorize('admin'), async (req, res) => {
    const { name, email, studentId, section, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const student = await User.create({
            name,
            email,
            studentId,
            section,
            password: password || 'Student@123', // Default password if not provided
            role: 'student'
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Bulk upload students via CSV
// @route   POST /api/admin/bulk-upload
// @access  Private/Admin
router.post('/bulk-upload', protect, authorize('admin'), upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = [];
    const filePath = path.join(__dirname, '../', req.file.path);

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const studentsToCreate = [];
                for (const row of results) {
                    // Basic validation
                    if (row.email && row.name) {
                        studentsToCreate.push({
                            name: row.name,
                            email: row.email,
                            studentId: row.studentId || `ST-${Math.floor(100000 + Math.random() * 900000)}`,
                            section: row.section || 'General',
                            password: row.password || 'Student@123',
                            role: 'student'
                        });
                    }
                }

                // Use insertMany with ordered: false to continue even if some fail (e.g. duplicate email)
                const created = await User.insertMany(studentsToCreate, { ordered: false });
                
                // Clean up file
                fs.unlinkSync(filePath);
                
                res.status(201).json({ 
                    message: `${created.length} students uploaded successfully`,
                    count: created.length 
                });
            } catch (error) {
                // If some succeeded but others failed (like duplicate key), we still want to report success count
                if (error.writeErrors) {
                    const successCount = results.length - error.writeErrors.length;
                    return res.status(201).json({ 
                        message: `Partial success: ${successCount} students uploaded. ${error.writeErrors.length} failed.`,
                        count: successCount
                    });
                }
                res.status(500).json({ message: error.message });
            }
        });
});

module.exports = router;
