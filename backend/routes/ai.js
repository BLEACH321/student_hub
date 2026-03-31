const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/summarize', aiController.summarize);
router.post('/study-plan', aiController.getStudyPlan);

module.exports = router;
