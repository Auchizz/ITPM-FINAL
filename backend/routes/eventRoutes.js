const express = require('express')
const router  = express.Router()

// GET /api/events
router.get('/', async (req, res) => {
  try {
    res.json({ success: true, data: [] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/events
router.post('/', async (req, res) => {
  try {
    res.status(201).json({ success: true, data: req.body })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router