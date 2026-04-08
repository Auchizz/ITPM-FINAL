const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin only
router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);

// Update own profile
router.put('/profile/me', authMiddleware, userController.updateMyProfile);

module.exports = router;
