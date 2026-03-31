const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Flashcard = sequelize.define('Flashcard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  nextReview: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Flashcard.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(Flashcard, { foreignKey: 'userId' });

module.exports = Flashcard;
