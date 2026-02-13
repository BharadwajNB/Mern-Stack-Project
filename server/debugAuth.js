console.log('Starting debugAuth script...');
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

const debugAuth = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const testEmail = 'debug@example.com';
        const testPass = 'password123';

        // Cleanup previous run
        await User.deleteOne({ email: testEmail });

        // Create User
        console.log(`Creating user ${testEmail} with password ${testPass}...`);
        const user = await User.create({
            name: 'Debug User',
            email: testEmail,
            password: testPass,
            role: 'student'
        });
        console.log('User created.');
        console.log('Hashed password in DB:', user.password);

        // Fetch again to be sure
        const fetchedUser = await User.findOne({ email: testEmail });

        // Test Match
        console.log('Testing matchPassword...');
        const isMatch = await fetchedUser.matchPassword(testPass);
        console.log(`Password match result: ${isMatch}`);

        if (isMatch) {
            console.log('SUCCESS: Authentication logic is working correctly.');
        } else {
            console.log('FAILURE: Password did not match immediately after creation.');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugAuth();
