const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, name, email, password, studentId, faculty, role, username, dateOfBirth, phone } = req.body;

    // Support both 'name' and 'firstName'+'lastName'
    const fullName = name || (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName);

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existing) return res.status(400).json({ success: false, message: 'Email or Student ID already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name: fullName, 
      email, 
      password: hashed, 
      studentId, 
      faculty, 
      role: role || 'student'
    });

    const token = signToken(user);
    res.status(201).json({ success: true, message: 'User created', data: { user: user.toJSON(), token } });
  } catch (err) {
    console.error('Register error:', err); // ← ADD THIS to see the real error in terminal
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { studentId, password } = req.body;
    if (!studentId || !password) {
      return res.status(400).json({ success: false, message: 'Student ID and password required' });
    }

    // Search by studentId OR username (case-insensitive)
    const user = await User.findOne({
      $or: [
        { studentId: studentId.toUpperCase() },
        { username: studentId },
        { studentId: studentId }
      ]
    }).select('+password');

    console.log('Login attempt:', studentId, '→ user found:', !!user);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ success: true, message: 'Logged in', data: { user: user.toJSON(), token } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, message: 'Profile fetched', data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};