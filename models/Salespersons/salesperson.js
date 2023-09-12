const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../../models/Auth/user');

const Salesperson = sequelize.define('Salesperson', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone_number: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  team: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  publisher_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'publishers',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
});

Salesperson.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Salesperson;