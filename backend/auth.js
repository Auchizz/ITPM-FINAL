// routes/auth.js
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { protect } = require('../middleware/auth');

const sendToken = (user, code, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
  user.password = undefined;
  res.status(code).json({ success:true, token, user: { id:user._id, studentId:user.studentId, firstName:user.firstName, lastName:user.lastName, email:user.email, department:user.department, role:user.role } });
};

// POST /api/auth/register
router.post('/register', [
  body('studentId').trim().matches(/^[A-Za-z0-9]{6,12}$/).withMessage('Student ID must be 6–12 alphanumeric characters'),
  body('firstName').trim().isLength({ min:2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min:2 }).withMessage('Last name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min:8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('department').notEmpty().withMessage('Department is required')
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success:false, errors:errs.array() });
  try {
    const { studentId, firstName, lastName, email, password, phone, department } = req.body;
    const existing = await User.findOne({ $or:[{ email },{ studentId:studentId.toUpperCase() }] });
    if (existing) return res.status(400).json({ success:false, message:`${existing.email===email?'Email':'Student ID'} is already registered.` });
    const user = await User.create({ studentId, firstName, lastName, email, password, phone, department });
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success:false, message:'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success:false, errors:errs.array() });
  try {
    const { studentId, password } = req.body;
    const user = await User.findOne({ studentId:studentId.toUpperCase() }).select('+password');
    if (!user || !user.isActive) return res.status(401).json({ success:false, message:'Invalid Student ID or password.' });
    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ success:false, message:'Invalid Student ID or password.' });
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave:false });
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success:false, message:'Server error. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json({ success:true, user:req.user }));

// POST /api/auth/logout
router.post('/logout', protect, (req, res) => res.json({ success:true, message:'Logged out successfully.' }));

module.exports = router;
