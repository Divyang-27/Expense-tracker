const Sequelize = require('sequelize');
const sequelize = new Sequelize('user_data', 'root', process.env.SQLPASSWORD, {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
