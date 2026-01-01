const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
// const { protect, admin } = require('../middleware/authMiddleware'); // Future: add admin check

router.get('/users', adminUserController.getAllUsers);

module.exports = router;
