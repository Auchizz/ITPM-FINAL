const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Update own profile — must be declared BEFORE /:id to avoid being matched as an id
router.put('/profile/me', authMiddleware, userController.updateMyProfile);

// Admin only
router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);

module.exports = router;
