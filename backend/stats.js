// routes/stats.js
const express = require('express');
const router  = express.Router();
const { Announcement, Event, Registration } = require('../models');

router.get('/', async (req, res) => {
  try {
    const [announcements, upcomingEvents, totalRegistrations] = await Promise.all([
      Announcement.countDocuments({ isActive: true }),
      Event.countDocuments({ isActive: true, eventDate: { $gte: new Date() } }),
      Registration.countDocuments({ status: 'confirmed' })
    ]);
    res.json({
      success: true,
      data: {
        totalStudents:       12840,
        activeCourses:       386,
        facultyMembers:      524,
        activeAnnouncements: announcements,
        upcomingEvents:      upcomingEvents,
        totalRegistrations:  totalRegistrations,
        onlineNow:           Math.floor(Math.random() * 80) + 1200
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
});

module.exports = router;