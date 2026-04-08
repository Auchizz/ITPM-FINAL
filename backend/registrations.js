// routes/registrations.js
const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const { Registration } = require('../models');
const { protect, staffOrAdmin } = require('../middleware/auth');

router.post('/', [
  body('firstName').trim().isLength({ min:2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min:2 }).withMessage('Last name must be at least 2 characters'),
  body('studentId').trim().matches(/^[A-Za-z0-9]{6,12}$/).withMessage('Student ID must be 6–12 alphanumeric characters'),
  body('phone').trim().matches(/^[0-9]{10}$/).withMessage('Phone number must be exactly 10 digits'),
  body('event').trim().notEmpty().withMessage('Please select an event'),
  body('specialNotes').optional().isLength({ max:200 }).withMessage('Notes cannot exceed 200 characters')
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success:false, errors:errs.array() });
  try {
    const existing = await Registration.findOne({ studentId:req.body.studentId.toUpperCase(), event:req.body.event, status:{ $ne:'cancelled' } });
    if (existing) return res.status(400).json({ success:false, message:'You are already registered for this event. Confirmation No: ' + existing.confirmationNo });
    const data = await Registration.create(req.body);
    res.status(201).json({ success:true, message:'Registration confirmed! A confirmation email will be sent to your university email address.', data:{ confirmationNo:data.confirmationNo, event:data.event, status:data.status } });
  } catch { res.status(500).json({ success:false, message:'Error submitting registration. Please try again.' }); }
});

router.get('/', protect, staffOrAdmin, async (req, res) => {
  try {
    const { event, limit=50 } = req.query;
    const filter = event ? { event } : {};
    const data = await Registration.find(filter).sort({ createdAt:-1 }).limit(parseInt(limit));
    res.json({ success:true, count:data.length, data });
  } catch { res.status(500).json({ success:false, message:'Error.' }); }
});

router.get('/check/:studentId/:event', async (req, res) => {
  try {
    const reg = await Registration.findOne({ studentId:req.params.studentId.toUpperCase(), event:decodeURIComponent(req.params.event), status:{ $ne:'cancelled' } });
    res.json({ success:true, registered:!!reg, data:reg || null });
  } catch { res.status(500).json({ success:false, message:'Error.' }); }
});

module.exports = router;
