const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        const students = [
            {
                name: 'Marcus Holloway',
                email: 'm.holloway@university.edu',
                studentId: 'ST-202401',
                section: 'Section A',
                password: 'Student@123',
                role: 'student',
                status: 'Active'
            },
            {
                name: 'Serafina Rossi',
                email: 's.rossi@university.edu',
                studentId: 'ST-202402',
                section: 'Section A',
                password: 'Student@123',
                role: 'student',
                status: 'Active'
            },
            {
                name: 'Julian Thorne',
                email: 'j.thorne@university.edu',
                studentId: 'ST-202403',
                section: 'Section B',
                password: 'Student@123',
                role: 'student',
                status: 'Active'
            },
            {
                name: 'Elias Vance',
                email: 'e.vance@university.edu',
                studentId: 'ST-202404',
                section: 'Section C',
                password: 'Student@123',
                role: 'student',
                status: 'Inactive'
            }
        ];

        for (const s of students) {
            const exists = await User.findOne({ email: s.email });
            if (!exists) {
                await User.create(s);
                console.log(`Created student: ${s.name}`);
            } else {
                console.log(`Student already exists: ${s.name}`);
            }
        }

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedStudents();
