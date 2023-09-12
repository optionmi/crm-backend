const { DataTypes } = require('sequelize');
const db = require('../../config/db');
const Salesperson = require('./salesperson');

const SpecimenSampling = db.define('SpecimenSampling', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sample_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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

module.exports = SpecimenSampling;