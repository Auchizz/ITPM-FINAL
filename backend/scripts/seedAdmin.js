require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedAdmin() {
  try {
    const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FACULTY, ADMIN_STUDENT_ID } = process.env;

    if (!MONGO_URI) {
      throw new Error('MONGO_URI is required in .env');
    }
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required in .env');
    }

    await mongoose.connect(MONGO_URI);

    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existing) {
      existing.role = 'admin';
      if (ADMIN_NAME) existing.name = ADMIN_NAME;
      if (ADMIN_FACULTY) existing.faculty = ADMIN_FACULTY;
      if (ADMIN_STUDENT_ID) existing.studentId = ADMIN_STUDENT_ID;
      if (ADMIN_PASSWORD) existing.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await existing.save();
      console.log('Existing user updated as admin:', existing.email);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const user = await User.create({
      name: ADMIN_NAME || 'Admin User',
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      faculty: ADMIN_FACULTY || '',
      studentId: ADMIN_STUDENT_ID || ''
    });

    console.log('Admin created successfully:', user.email);
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedAdmin();
