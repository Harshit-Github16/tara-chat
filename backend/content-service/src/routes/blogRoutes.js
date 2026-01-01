const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/:id', blogController.getBlogDetail);
router.post('/:id/view', blogController.incrementView);
router.post('/:id/like', blogController.likeBlog);
router.post('/:id/comment', blogController.addComment);

module.exports = router;
