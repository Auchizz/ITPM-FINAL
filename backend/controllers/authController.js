<<<<<<< HEAD
const bcrypt = require('bcryptjs'); 
=======
const bcrypt = require('bcryptjs');
>>>>>>> origin/main
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

exports.register = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const { name, email, password, studentId, faculty, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, studentId, faculty, role });
    const token = signToken(user);
    res.status(201).json({ success: true, message: 'User created', data: { user: user.toJSON(), token } });
  } catch (err) {
>>>>>>> origin/main
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ success: true, message: 'Logged in', data: { user: user.toJSON(), token } });
  } catch (err) {
>>>>>>> origin/main
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, message: 'Profile fetched', data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> origin/main
