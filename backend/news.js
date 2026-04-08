// routes/news.js
const express = require('express');
const router  = express.Router();
const { News } = require('../models');

router.get('/', async (req, res) => {
  try {
    const { limit=10, category } = req.query;
    const filter = { isPublished:true };
    if (category) filter.category = category;
    const data = await News.find(filter).sort({ createdAt:-1 }).limit(parseInt(limit));
    res.json({ success:true, count:data.length, data });
  } catch { res.status(500).json({ success:false, message:'Error fetching news.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await News.findByIdAndUpdate(req.params.id, { $inc:{ views:1 } }, { new:true });
    if (!data) return res.status(404).json({ success:false, message:'Not found.' });
    res.json({ success:true, data });
  } catch { res.status(500).json({ success:false, message:'Error.' }); }
});

module.exports = router;
