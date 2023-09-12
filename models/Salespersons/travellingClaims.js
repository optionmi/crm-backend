const { DataTypes } = require('sequelize');
const db = require('../../config/db');
const Salesperson = require('./salesperson');

const TravellingClaims = db.define('TravellingClaims', {
  claim_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  claim_description: {
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

TravellingClaims.belongsTo(Salesperson, { foreignKey: 'salesperson_id' });

module.exports = TravellingClaims;