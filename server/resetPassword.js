const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/amsd');

    const newPassword = 'Test1234';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await mongoose.connection.db.collection('users').updateOne(
        { email: 'bharadwajnb23@gmail.com' },
        { $set: { password: hash } }
    );

    console.log('Password reset successfully!');
    console.log('Email: bharadwajnb23@gmail.com');
    console.log('Password: Test1234');

    await mongoose.disconnect();
};

resetPassword().catch(console.error);
