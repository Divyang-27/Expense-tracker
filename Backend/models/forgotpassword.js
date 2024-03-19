const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

const Forgotpassword = sequelize.define('forgotpassword', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
  },
  userId: Sequelize.INTEGER,
  isActive: Sequelize.BOOLEAN,
});

module.exports = Forgotpassword;
