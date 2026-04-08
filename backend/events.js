// routes/events.js
const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const { Event } = require('../models');
const { protect, staffOrAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { limit=6, featured } = req.query;
    const filter = { isActive:true, eventDate:{ $gte:new Date() } };
    if (featured === 'true') filter.isFeatured = true;
    const data = await Event.find(filter).sort({ eventDate:1 }).limit(parseInt(limit));
    res.json({ success:true, count:data.length, data });
  } catch { res.status(500).json({ success:false, message:'Error fetching events.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Event.findById(req.params.id);
    if (!data) return res.status(404).json({ success:false, message:'Not found.' });
    res.json({ success:true, data });
  } catch { res.status(500).json({ success:false, message:'Error.' }); }
});

router.post('/', protect, staffOrAdmin, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('eventDate').isISO8601().withMessage('Valid event date required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required')
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success:false, errors:errs.array() });
  try {
    const data = await Event.create({ ...req.body, createdBy:req.user._id });
    res.status(201).json({ success:true, data });
  } catch { res.status(500).json({ success:false, message:'Error creating event.' }); }
});

module.exports = router;
