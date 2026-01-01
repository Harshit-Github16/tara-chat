const express = require('express');
const router = express.Router();
const imagekitController = require('../controllers/imagekitController');

router.get('/', imagekitController.getAuthParameters);

module.exports = router;
