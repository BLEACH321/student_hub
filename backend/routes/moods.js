const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', moodController.getMoods);
router.post('/', moodController.createMood);
router.delete('/:id', moodController.deleteMood);

module.exports = router;
