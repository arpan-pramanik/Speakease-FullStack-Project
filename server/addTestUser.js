// Quick script to add the test user
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Progress = require('./models/Progress');

const addTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ email: 'testuser@test.com' });
        if (existing) {
            console.log('Test user already exists, skipping...');
        } else {
            const user = await User.create({
                name: 'Test User',
                email: 'testuser@test.com',
                password: '12345678'
            });
            await Progress.create({ userId: user._id });
            console.log('✅ Test user created: testuser@test.com / 12345678');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

addTestUser();
