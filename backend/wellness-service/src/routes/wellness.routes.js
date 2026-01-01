const express = require('express');
const router = express.Router();
const wellnessController = require('../controllers/wellnessController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/quiz/results', wellnessController.getQuizResults);
router.post('/quiz/results', wellnessController.saveQuizResult);
router.post('/stress-check', wellnessController.saveStressCheck);
router.get('/emotional-wheel', wellnessController.getEmotionalWheel);
router.post('/emotional-wheel', wellnessController.saveEmotionalWheel);
router.get('/reflection-radar', wellnessController.getReflectionRadar);
router.post('/reflection-radar', wellnessController.saveReflectionRadar);
router.get('/user-data', wellnessController.getUserData);

// Mood Routes
const moodController = require('../controllers/moodController');
router.get('/mood', moodController.getMoods);
router.post('/mood', moodController.saveMood);
router.get('/mood/insights', moodController.getMoodInsights);

// Journal Routes
const journalController = require('../controllers/journalController');
router.get('/journal', journalController.getJournals);
router.post('/journal', journalController.createJournal);
router.patch('/journal', journalController.updateJournal);
router.delete('/journal', journalController.deleteJournal);

// Goal Routes
const goalController = require('../controllers/goalController');
router.get('/goals', goalController.getGoals);
router.post('/goals', goalController.createGoal);
router.post('/goals/goal-status', goalController.updateGoalStatus);
router.patch('/goals/:goalId', goalController.checkInGoal);

// Insight Routes
const insightController = require('../controllers/insightController');
router.get('/insights/stats', insightController.getInsightStats);

module.exports = router;
