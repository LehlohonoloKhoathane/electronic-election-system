const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const voteController = require('../controllers/voteController');

router.post('/register', authController.registerVoter);
router.post('/login', authController.loginUser);
router.post('/vote', voteController.castVote);

module.exports = router;
