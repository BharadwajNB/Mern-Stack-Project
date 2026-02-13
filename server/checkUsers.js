console.log('Starting script...');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
let User;
try {
    User = require('./models/User');
} catch (e) {
    console.error('Error loading User model:', e);
    process.exit(1);
}

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find({});

        if (users.length > 0) {
            console.log('Existing Users:');
            users.forEach(user => {
                console.log(`- Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
            });
        } else {
            console.log('No users found in the database.');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
