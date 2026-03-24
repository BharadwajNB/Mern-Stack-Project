const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Ensure student exists
        const studentEmail = 'test@example.com';
        const existingStudent = await User.findOne({ email: studentEmail });
        if (!existingStudent) {
            await User.create({
                name: 'Test Student',
                email: studentEmail,
                password: 'password123',
                role: 'student'
            });
            console.log('Student test@example.com created.');
        } else {
            console.log('Student test@example.com already exists.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
