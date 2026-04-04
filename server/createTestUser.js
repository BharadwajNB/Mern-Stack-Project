console.log('Starting createTestUser script...');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

let User;
try {
    User = require('./models/User');
} catch (e) {
    console.error('Error loading User model:', e);
    process.exit(1);
}

dotenv.config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if test user exists
        const testEmail = '24b11cs259@adityauniversity.in';
        const userExists = await User.findOne({ email: testEmail });

        if (userExists) {
            console.log(`Test user already exists: ${testEmail}`);
        } else {
            const user = await User.create({
                name: 'Test Student',
                email: testEmail,
                password: 'password123',
                role: 'student',
                department: 'Computer Science'
            });
            console.log(`Test user created: ${user.email} / password123`);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createTestUser();
