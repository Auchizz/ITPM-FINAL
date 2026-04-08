// routes/gallery.js
const express = require('express');
const router  = express.Router();
const { Gallery } = require('../models');

router.get('/', async (req, res) => {
  try {
    const data = await Gallery.find({ isActive:true }).sort({ isFeatured:-1, order:1 });
    res.json({ success:true, count:data.length, data });
  } catch { res.status(500).json({ success:false, message:'Error fetching gallery.' }); }
});

module.exports = router;
