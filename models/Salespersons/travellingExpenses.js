const { DataTypes } = require('sequelize');
const db = require('../../config/db');
const Salesperson = require('./salesperson');

const TravellingExpenses = db.define('TravellingExpenses', {
  expense_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  expense_description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

TravellingExpenses.belongsTo(Salesperson, { foreignKey: 'salesperson_id' });

module.exports = TravellingExpenses;