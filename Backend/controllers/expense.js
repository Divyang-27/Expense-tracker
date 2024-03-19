const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../utils/database');

const postExpense = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    req.body.userId = userId;
    const expense = await Expense.create(req.body, { transaction });
    if (expense.amount === undefined || expense.amount.length === 0) {
      return res
        .status(400)
        .send({ success: fail, message: 'Parameters are missing' });
    }
    const totalExpense = Number(req.user.totalExpense) + Number(expense.amount);
    await User.update(
      { totalExpense },
      {
        where: {
          id: userId,
        },
        transaction,
      }
    );
    await transaction.commit();
    res.status(201).send({
      success: true,
      message: 'Expense created',
      expenseDetails: expense,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenseList = await Expense.findAll({ where: { userId } });
    res.status(201).send({ success: true, expenseDetails: expenseList });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const deleteExpense = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;
    const amount = req.query.amount;
    const totalExpense = req.user.totalExpense - Number(amount);

    await Expense.destroy({
      where: {
        id: expenseId,
      },
      transaction,
    });
    await User.update(
      { totalExpense },
      {
        where: {
          id: userId,
        },
        transaction,
      }
    );
    await transaction.commit();
    res.status(200).send({ success: true, message: 'Expense Deleted' });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  postExpense,
  getExpense,
  deleteExpense,
};
