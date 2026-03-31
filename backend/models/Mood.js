const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Mood = sequelize.define('Mood', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Mood.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(Mood, { foreignKey: 'userId' });

module.exports = Mood;
