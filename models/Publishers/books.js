const Sequelize = require('sequelize');
const db = require('../../config/db');
const Publisher = require('./publisher');

const Books = db.define(
    'Books',
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
      },
      publisher_id: {
        type: Sequelize.INTEGER,
      },
      board: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      standard: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
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
    }
);

Books.belongsTo(Publisher, { foreignKey: 'publisher_id' });

module.exports = Books