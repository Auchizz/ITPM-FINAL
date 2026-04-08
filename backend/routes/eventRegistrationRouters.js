const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
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
router.patch('/:id/cancel', cancelRegistration);

module.exports = router;
