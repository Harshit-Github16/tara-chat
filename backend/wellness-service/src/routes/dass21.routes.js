const express = require('express');
const router = express.Router();
const dass21Controller = require('../controllers/dass21.controller');

router.post('/', dass21Controller.saveAssessment);
router.get('/', dass21Controller.getAssessments);

module.exports = router;
