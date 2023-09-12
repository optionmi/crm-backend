const SpecimenSampling = require('../../models/Salespersons/specimenSampling');
const Salespeople = require('../../models/Salespersons/salesperson');

// Function to create a new specimen sampling
const createSampling = async (req, res) => {
  try {
    const { description, bookId } = req.body;

    // Check if the user has the required role (SalesTeam, SalesCoordinationTeam, ProductandTrainingTeam, or DispatchandWarehouseTeam)
    const user = await Salespeople.findOne({ where: { user_id: sale } });
    if (
      user &&
      (user.team === 'SalesTeam' ||
        user.team === 'SalesCoordinationTeam' ||
        user.team === 'ProductandTrainingTeam' ||
        user.team === 'DispatchandWarehouseTeam')
    ) {
      // Create the specimen sampling
      const sampling = await SpecimenSampling.create({
        salesperson_id: salespersonId,
        description,
        book_id: bookId,
      });

      return res.status(201).json(sampling);
    } else {
      return res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createSampling };