const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const orderController = require('../controllers/order');

router.get(
  '/premiummember',
  authMiddleware.authenticate,
  orderController.purchasePremium
);
router.post(
  '/updatetransactionstatus',
  authMiddleware.authenticate,
  orderController.updatetransactionstatus
);
module.exports = router;
