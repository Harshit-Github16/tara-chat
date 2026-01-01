const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controller');

router.post('/', journalController.handleJournal);
router.delete('/', journalController.deleteJournal);

module.exports = router;
