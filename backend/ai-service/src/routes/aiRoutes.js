const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

const { protect } = require('../middleware/authMiddleware'); // Need to ensure it exists

const moodTriggersController = require('../controllers/moodTriggersController');

router.post('/quiz/generate', aiController.generateQuiz);
router.get('/pattern-analysis', protect, aiController.analyzePatterns);
router.post('/suggestions/generate', aiController.generateSuggestions);
router.get('/mood-triggers', protect, moodTriggersController.analyzeMoodTriggers);
router.post('/tara-chat', protect, aiController.processTaraChat);
router.post('/journal-generate', aiController.generateJournal);

module.exports = router;
