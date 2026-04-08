const express = require('express')
const router  = express.Router()

router.get('/', async (req, res) => {
  try {
    res.json({ success: true, data: [] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    res.status(201).json({ success: true, data: req.body })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router