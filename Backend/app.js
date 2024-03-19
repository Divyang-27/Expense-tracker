require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database.js');

const User = require('./models/user.js');
const Expense = require('./models/expense.js');
const Order = require('./models/order.js');
const Forgotpassword = require('./models/forgotpassword.js');

app.use(cors());
app.use(bodyParser.json({ extended: false }));

const userRoutes = require('./routes/user.js');
const expenseRoutes = require('./routes/expense.js');
const orderRoutes = require('./routes/order.js');
const forgotpwRoutes = require('./routes/resetpassword.js');
const premiumFeatureRoutes = require('./routes/premium.js');

app.use('/user', userRoutes);
app.use('/user/expense', expenseRoutes);
app.use('/password', forgotpwRoutes);
app.use('/purchase', orderRoutes);
app.use('/premium', premiumFeatureRoutes);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Forgotpassword.belongsTo(User);
User.hasMany(Forgotpassword);
User.hasMany(Expense);
User.hasMany(Order);

const PORT = process.env.PORT;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
