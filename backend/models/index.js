/**
 * models/index.js
 * Import model definitions and setup associations
 */

const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Bus = require('./bus')(sequelize, Sequelize.DataTypes);
const Schedule = require('./schedule')(sequelize, Sequelize.DataTypes);

// Associations
Bus.hasMany(Schedule, { foreignKey: 'busId', as: 'schedules', onDelete: 'CASCADE' });
Schedule.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Bus,
  Schedule
};
