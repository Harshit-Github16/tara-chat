const express = require('express');
const router = express.Router();
const adminBlogController = require('../controllers/adminBlogController');

router.get('/', adminBlogController.getAllBlogs);
router.post('/', adminBlogController.processBlog);
router.delete('/', adminBlogController.deleteBlog);

module.exports = router;
