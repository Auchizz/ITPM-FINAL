const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
    registerStudent,
    getRegistrationsByEvent,
    getMyRegistrations,
    getRegistrationById,
    cancelRegistration,
} = require('../controllers/eventRegistrationControllers');

router.post('/', authMiddleware, registerStudent);
router.get('/event/:eventId', getRegistrationsByEvent);
router.get('/student', authMiddleware, getMyRegistrations);
router.get('/:id', getRegistrationById);
// Require auth + admin role to cancel a registration
router.patch('/:id/cancel', authMiddleware, roleMiddleware(['admin']), cancelRegistration);

module.exports = router;
