const { DataTypes } = require('sequelize');
const db = require('../../config/db');
const Salesperson = require('./salesperson');

const Attendance = db.define('Attendance', {
  attendance_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  is_present: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

Attendance.belongsTo(Salesperson, { foreignKey: 'salesperson_id' });

module.exports = Attendance;