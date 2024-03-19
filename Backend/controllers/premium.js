const User = require('../models/user');

const getUserLeaderboard = async (req, res) => {
  try {
    const userLeaderboard = await User.findAll(
      { where: { id: req.user.id } },
      {
        order: [['totalExpense', 'DESC']],
      }
    );
    res.status(200).send(userLeaderboard);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  getUserLeaderboard,
};
