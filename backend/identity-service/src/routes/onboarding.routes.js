const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');
const { protect } = require('../middleware/authMiddleware'); // Wait, check if identity-service has auth middleware

router.use(protect); // Need to ensure protect middleware exists in identity-service

router.get('/', onboardingController.getOnboardingData);
router.post('/', onboardingController.completeOnboarding);

module.exports = router;
