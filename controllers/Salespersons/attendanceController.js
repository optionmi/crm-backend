const Attendance = require('../../models/Salespersons/attendance');
const Salespeople = require('../../models/Salespersons/salesperson');

// Function to create attendance
const createAttendance = async (req, res) => {
  try {
    const { is_present } = req.body;

    // Check if the user is in the 'SalesTeam'
    const user = await Salespeople.findOne({ where: { user_id: req.user.id, team: 'SalesTeam' } });
    if (user) {
      // Create the attendance record
      const attendance = await Attendance.create({
        salesperson_id: user.id,
        is_present
      });

      return res.status(201).json(attendance);
    } else {
      return res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Function to get attendance by salesperson_id
const getAttendance = async (req, res) => {
  try {
    const { salespersonId } = req.params;

    // Check if the user is in the 'SalesTeam'
    const user = await Salespeople.findOne({ where: { id: salespersonId, team: 'SalesTeam' } });
    if (user) {
      // Retrieve attendance records by salesperson_id
      const attendance = await Attendance.findAll({
        where: { salesperson_id: salespersonId },
      });

      return res.status(200).json(attendance);
    } else {
      return res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createAttendance, getAttendance };