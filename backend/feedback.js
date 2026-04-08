// routes/feedback.js
const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const { Feedback } = require('../models');
const { protect, staffOrAdmin } = require('../middleware/auth');

router.post('/', [
  body('fullName').trim().isLength({ min:2 }).withMessage('Full name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('message').trim().isLength({ min:20 }).withMessage('Message must be at least 20 characters')
    .isLength({ max:500 }).withMessage('Message cannot exceed 500 characters')
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success:false, errors:errs.array() });
  try {
    const data = await Feedback.create(req.body);
    res.status(201).json({ success:true, message:'Your query has been submitted successfully. We will respond within 2 business days.', data:{ id:data._id, status:data.status } });
  } catch { res.status(500).json({ success:false, message:'Error submitting feedback. Please try again.' }); }
});

router.get('/', protect, staffOrAdmin, async (req, res) => {
  try {
    const { status, limit=20 } = req.query;
    const filter = status ? { status } : {};
    const data = await Feedback.find(filter).sort({ createdAt:-1 }).limit(parseInt(limit));
    res.json({ success:true, count:data.length, data });
  } catch { res.status(500).json({ success:false, message:'Error.' }); }
});

router.patch('/:id', protect, staffOrAdmin, async (req, res) => {
  try {
    const { status, response } = req.body;
    const data = await Feedback.findByIdAndUpdate(req.params.id, { status, response, respondedAt:new Date() }, { new:true });
    if (!data) return res.status(404).json({ success:false, message:'Not found.' });
    res.json({ success:true, data });
  } catch { res.status(500).json({ success:false, message:'Error.' }); }
});

module.exports = router;
