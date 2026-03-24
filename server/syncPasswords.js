const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const syncPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const testAccounts = [
            'test@example.com',
            'surya@adityauniversity.in'
        ];

        const newPassword = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        for (const email of testAccounts) {
            const result = await User.updateOne(
                { email },
                { $set: { password: hashedPassword } }
            );

            if (result.matchedCount > 0) {
                console.log(`Updated password for: ${email}`);
            } else {
                console.log(`User not found: ${email}`);
            }
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

syncPasswords();
