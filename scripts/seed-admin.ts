import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dani:123@cluster0.q8xqxkt.mongodb.net/?appName=Cluster0';

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@yourstore.com';
        const adminPassword = 'Admin@123'; // Change this to a secure password

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists. Updating password...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('✅ Admin user updated successfully!');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
        } else {
            // Create admin user
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const admin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
            });
            console.log('✅ Admin user created successfully!');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();

