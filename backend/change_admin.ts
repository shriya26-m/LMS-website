import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from './src/modules/users/user.model';
import bcrypt from 'bcryptjs';

/**
 * UTILITY: Change Admin Credentials
 * 
 * Usage:
 * 1. Update the NEW_EMAIL and NEW_PASSWORD variables below.
 * 2. Run: npx ts-node change_admin.ts
 */

async function changeAdminCredentials() {
    const NEW_EMAIL = 'admin@lms.com'; // Change this if needed
    const NEW_PASSWORD = 'admin123';    // Change this to your desired password

    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms');

    // Find the current admin (assuming role is 'admin')
    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
        console.error('❌ Error: No admin user found in the database.');
        await mongoose.connection.close();
        process.exit(1);
    }

    console.log(`Updating admin account: ${admin.email}`);

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    admin.email = NEW_EMAIL;
    admin.password = hashedPassword;
    await admin.save();

    console.log('✅ Success: Admin credentials updated successfully!');
    console.log(`New Email: ${NEW_EMAIL}`);
    console.log('New Password: [UPDATED]');

    await mongoose.connection.close();
}

changeAdminCredentials().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
