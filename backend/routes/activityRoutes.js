const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const activityController = require('../controllers/activityController');

const router = express.Router();

router.use(authMiddleware);

router.get('/catalog', activityController.getCatalog);
router.get('/overview', activityController.getOverview);

router.get('/participations', activityController.listParticipations);
router.post('/participations', activityController.createParticipation);
router.put('/participations/:id/status', roleMiddleware(['admin']), activityController.updateParticipationStatus);

router.get('/feedback', activityController.listFeedback);
router.post('/feedback', activityController.createFeedback);

router.get('/notifications', activityController.listNotifications);
router.patch('/notifications/read-all', activityController.markAllNotificationsRead);
router.patch('/notifications/:id/read', activityController.markNotificationRead);

module.exports = router;
