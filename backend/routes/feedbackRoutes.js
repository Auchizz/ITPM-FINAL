const express = require('express')
const router  = express.Router()

router.post('/', async (req, res) => {
  try {
    console.log('Feedback received:', req.body)
    res.status(201).json({ success: true, message: 'Feedback submitted successfully.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
