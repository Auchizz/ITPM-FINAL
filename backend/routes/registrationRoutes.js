const express = require('express')
const router  = express.Router()

router.post('/', async (req, res) => {
  try {
    const confirmationNo = 'REG-' + Date.now().toString().slice(-6)
    res.status(201).json({ success: true, data: { confirmationNo }, message: 'Registration confirmed!' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
