const Razorpay = require('razorpay');
const Order = require('../models/order');
const userController = require('./user');

const purchasePremium = async (req, res) => {
  const { RZP_KEY_ID, RZP_KEY_SECRET } = process.env;
  try {
    const rzp = new Razorpay({
      key_id: RZP_KEY_ID,
      key_secret: RZP_KEY_SECRET,
    });
    var option = {
      amount: 2500,
      currency: 'INR',
    };
    rzp.orders.create(option, (err, order) => {
      console.log(order);
      if (err) {
        console.log(`${err}`);
      }
      req.user
        .createOrder({ orderid: order.id, status: 'PENDING' })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const updatetransactionstatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    const userId = order.userId;
    const promise1 = order.update({
      paymentid: payment_id,
      status: 'SUCCESSFUL',
    });
    const promise2 = req.user.update({ ispremiumuser: true });
    const token = userController.generateToken(userId, true);
    await Promise.all([promise1, promise2]);
    return res.status(202).json({
      success: true,
      message: 'Transaction successful',
      token: token,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  purchasePremium,
  updatetransactionstatus,
};
