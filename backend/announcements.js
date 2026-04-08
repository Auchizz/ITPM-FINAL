// routes/announcements.js
const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const { Announcement } = require('../models');
const { protect, staffOrAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { limit=10, priority } = req.query;
    const filter = { isActive:true };
    if (priority) filter.priority = priority;
    const data = await Announcement.find(filter).sort({ isPinned:-1, createdAt:-1 }).limit(parseInt(limit));
    res.json({ success:true, count:data.length, data });
  } catch { res.status(500).json({ success:false, message:'Error fetching announcements.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Announcement.findById(req.params.id);
    if (!data) return res.status(404).json({ success:false, message:'Not found.' });
    res.json({ success:true, data });
  } catch { res.status(500).json({ success:false, message:'Error.' }); }
});

router.post('/', protect, staffOrAdmin, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('priority').isIn(['urgent','info','success','warning']).withMessage('Invalid priority')
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success:false, errors:errs.array() });
  try {
    const data = await Announcement.create({ ...req.body, createdBy:req.user._id });
    res.status(201).json({ success:true, data });
  } catch { res.status(500).json({ success:false, message:'Error creating announcement.' }); }
});

router.put('/:id', protect, staffOrAdmin, async (req, res) => {
  try {
    const data = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true });
    if (!data) return res.status(404).json({ success:false, message:'Not found.' });
    res.json({ success:true, data });
  } catch { res.status(500).json({ success:false, message:'Error updating.' }); }
});

router.delete('/:id', protect, staffOrAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, { isActive:false });
    res.json({ success:true, message:'Removed.' });
  } catch { res.status(500).json({ success:false, message:'Error.' }); }
});

module.exports = router;
