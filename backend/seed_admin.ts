import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from './src/modules/users/user.model';
import bcrypt from 'bcryptjs';

/**
 * UTILITY: Seed Admin User
 * 
 * Usage: npx ts-node seed_admin.ts
 */
// npx ts-node change_admin.ts
// npx ts-node seed_admin.ts

async function seedAdmin() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms');

    const email = 'admin@lms.com';
    const password = 'admin123';

    const existing = await User.findOne({ email });
    if (existing) {
        console.log('✅ Admin already exists with this email.');
        await mongoose.connection.close();
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
        name: 'System Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        status: 'active'
    });

    console.log('🚀 Admin created successfully:', admin.email);
    await mongoose.connection.close();
}

seedAdmin().catch(console.error);
