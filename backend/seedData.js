require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

/**
 * Seed script to create sample users for testing
 * Run with: node seedData.js
 */

const sampleUsers = [
    {
        name: 'Admin User',
        email: 'admin@university.edu',
        password: 'admin123',
        role: 'admin'
    },
    {
        name: 'John Student',
        email: 'student@university.edu',
        password: 'student123',
        role: 'student'
    },
    {
        name: 'Jane Staff',
        email: 'staff@university.edu',
        password: 'staff123',
        role: 'staff'
    },
    {
        name: 'Dr. HOD',
        email: 'hod@university.edu',
        password: 'hod123',
        role: 'hod'
    },
    {
        name: 'Alice Student',
        email: 'alice@university.edu',
        password: 'alice123',
        role: 'student'
    },
    {
        name: 'Bob Student',
        email: 'bob@university.edu',
        password: 'bob123',
        role: 'student'
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Clear existing users (optional - comment out if you want to keep existing data)
        await User.deleteMany({});
        console.log('✓ Cleared existing users');

        // Create sample users
        for (const userData of sampleUsers) {
            const user = await User.create(userData);
            console.log(`✓ Created ${user.role}: ${user.email}`);
        }

        console.log('\n✓ Database seeded successfully!');
        console.log('\nSample Login Credentials:');
        console.log('─────────────────────────────────────────');
        sampleUsers.forEach(user => {
            console.log(`${user.role.toUpperCase().padEnd(10)} | ${user.email.padEnd(25)} | ${user.password}`);
        });
        console.log('─────────────────────────────────────────');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();
