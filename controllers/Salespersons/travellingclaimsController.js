const TravellingClaims = require('../../models/Salespersons/travellingClaims');
const Salespeople = require('../../models/Salespersons/salesperson');

// Function to create a new travelling claim
const createClaim = async (req, res) => {
  try {
    const { claim_description, amount, claim_date } = req.body;

    // Check if the user has the required role (SalesTeam, SalesCoordinationTeam, or FinanceTeam)
    const user = await Salespeople.findOne({ where: { user_id: req.user.id } });
    if (
      user &&
      (user.team === 'SalesTeam' ||
        user.team === 'SalesCoordinationTeam' ||
        user.team === 'FinanceTeam')
    ) {
      // Create the travelling claim
      const claim = await TravellingClaims.create({
        salesperson_id: user.id,
        claim_description,
        amount,
        claim_date,
      });

      return res.status(201).json(claim);
    } else {
      return res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Function to get all travelling claims
const getAllClaims = async (req, res) => {
  try {
    // Retrieve all travelling claims
    const claims = await TravellingClaims.findAll();

    return res.status(200).json(claims);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createClaim, getAllClaims };