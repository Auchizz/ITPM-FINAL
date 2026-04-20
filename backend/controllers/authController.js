const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, studentId, faculty } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    // role is always 'student' on self-registration — never trust client-supplied role
    const user = await User.create({ name, email, password: hashed, studentId, faculty, role: 'student' });
    const token = signToken(user);
    res.status(201).json({ success: true, message: 'User created', data: { user: user.toJSON(), token } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ success: true, message: 'Logged in', data: { user: user.toJSON(), token } });
  } catch (err) {
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
