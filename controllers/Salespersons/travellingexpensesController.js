const TravellingExpenses = require('../../models/Salespersons/travellingExpenses');
const Salespeople = require('../../models/Salespersons/salesperson');

// Function to create a new travelling expense
const createExpense = async (req, res) => {
  try {
    const {expense_description, amount } = req.body;

    // Check if the user has the required role (SalesTeam, SalesCoordinationTeam, or FinanceTeam)
    const user = await Salespeople.findOne({ where: { user_id: req.user.id } });
    if (
      user &&
      (user.team === 'SalesTeam' ||
        user.team === 'SalesCoordinationTeam' ||
        user.team === 'FinanceTeam')
    ) {
      // Create the travelling expense
      const expense = await TravellingExpenses.create({
        salesperson_id: user.id,
        expense_description,
        amount,
        expense_date: new Date(),
      });

      return res.status(201).json(expense);
    } else {
      return res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Function to get all travelling expenses
const getAllExpenses = async (req, res) => {
  try {
    // Retrieve all travelling expenses
    const expenses = await TravellingExpenses.findAll();

    return res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createExpense, getAllExpenses };