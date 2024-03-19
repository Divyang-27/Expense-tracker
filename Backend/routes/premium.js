const express = require('express');
const router = express.Router();
const premimumController = require('../controllers/premium');
const authMiddleware = require('../middlewares/auth');

router.get(
  '/leaderboard',
  authMiddleware.authenticate,
  premimumController.getUserLeaderboard
);

module.exports = router;
