const Salesperson = require('../../models/Salespersons/salesperson');
const Attendance = require('../../models/Salespersons/attendance');

// Create attendance (only accessible to SalesTeam)
const createAttendance = async (req, res) => {
  // Check if the user is a salesperson
  if (req.user.user_type === 'salesperson') {
    try {
      const salesperson = await Salesperson.findOne({
        where: {
          user_id: req.user.id,
          team: 'SalesTeam', // Check if the salesperson belongs to the 'SalesTeam'
        },
      });

      if (!salesperson) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      // Continue with attendance creation logic
      const { is_present, notes } = req.body;
      const attendance = await Attendance.create({
        salesperson_id: salesperson.id,
        is_present,
        notes,
      });


      res.status(201).json(attendance);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  } else {
    return res.status(403).json({ message: 'Permission denied' });
  }
};

module.exports = { createAttendance };