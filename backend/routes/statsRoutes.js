const express = require('express')
const router  = express.Router()

router.get('/', async (req, res) => {
  try {
    // Replace with real DB aggregation queries
    res.json({
      success: true,
      data: {
        totalStudents:  12840,
        activeCourses:  386,
        upcomingEvents: 8,
        facultyMembers: 524,
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
