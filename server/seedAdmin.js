const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminEmail = 'surya@adityauniversity.in';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`Admin ${adminEmail} already exists.`);
            process.exit();
        }

        const admin = await User.create({
            name: 'Surya (Admin)',
            email: adminEmail,
            password: 'password123', // Will be hashed by pre-save hook
            role: 'admin'
        });

        console.log('Admin user created successfully:');
        console.log('Email:', admin.email);
        console.log('Password: password123');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
