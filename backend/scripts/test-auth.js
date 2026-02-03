import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

async function testAuthDatabase() {
    try {
        console.log('🔍 Testing MongoDB Atlas Connection...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas successfully!\n');

        // Check database name
        const dbName = mongoose.connection.db.databaseName;
        console.log(`📊 Database: ${dbName}\n`);

        // Count total users
        const userCount = await User.countDocuments();
        console.log(`👥 Total users in database: ${userCount}\n`);

        // Fetch all users (excluding passwords)
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        if (users.length > 0) {
            console.log('📋 Users in database:');
            console.log('─'.repeat(80));
            users.forEach((user, index) => {
                console.log(`${index + 1}. Name: ${user.name || 'N/A'}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Created: ${user.createdAt.toLocaleString()}`);
                console.log(`   ID: ${user._id}`);
                console.log('─'.repeat(80));
            });
        } else {
            console.log('⚠️  No users found in database.');
            console.log('💡 Try signing up a new user through the frontend to test.');
        }

        console.log('\n✅ Database test completed successfully!');

    } catch (error) {
        console.error('❌ Error testing database:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
        process.exit(0);
    }
}

testAuthDatabase();
