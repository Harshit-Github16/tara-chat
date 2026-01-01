const express = require('express');
const router = express.Router();
const moodController = require('../controllers/mood.controller');

router.post('/', moodController.addMood);
router.get('/', moodController.getMoods);

module.exports = router;
