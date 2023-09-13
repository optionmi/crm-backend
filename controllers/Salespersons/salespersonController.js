const Salesperson = require('../../models/Salespersons/salesperson');
const bcrypt = require('bcrypt');
const User = require('../../models/Auth/user')
const publisher = require('../../models/publishers/publisher');


// Create a new salesperson
const createSalesperson = async (req, res) => {

  // Check if the user is authorized (admin or publisher)
  if (req.user.user_type !== 'admin' && req.user.user_type !== 'publisher') {
    return res.status(403).json({ message: 'Permission denied' });
  }


  // Extract salesperson data from the request body
  const { name, email, phone_number, team, password } = req.body;

  try {

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 11);

    var creatorId = null;

    if(req.user.user_type==='publisher'){
      const publisher = await publisher.findOne({ where: { user_id: req.user.id } });
      if(publisher){
        creatorId = publisher.id
      }
    }

    // Create the user in the Users table
    const user = await User.create({
      email: email,
      password: hashedPassword,
      user_type: 'salesperson',
    });


    if (!user || !user.id) {
      return res.status(500).json({ message: 'User creation failed' });
    }

    console.log(creatorId)

    // Create the salesperson
    const salesperson = await Salesperson.create({
      user_id: user.id,
      name,
      email,
      phone_number,
      team,
      publisher_id: creatorId
    });

    return res.status(201).json(salesperson);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Function to fetch a salesperson by ID (accessible to admin and publisher)
const getSalespersonById = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the user is an admin or publisher
    if (req.user.user_type !== 'admin' && req.user.user_type !== 'publisher') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Fetch the salesperson by ID
    const salesperson = await Salesperson.findByPk(id);

    if (salesperson) {
      return res.status(200).json(salesperson);
    } else {
      return res.status(404).json({ message: 'Salesperson not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Function to fetch all salespersons (accessible to admin and publisher)
const getAllSalespersons = async (req, res) => {
  try {
    // Check if the user is an admin or publisher
    if (req.user.user_type !== 'admin' && req.user.user_type !== 'publisher') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Fetch all salespersons
    const salespersons = await Salesperson.findAll();

    if (salespersons.length > 0) {
      return res.status(200).json(salespersons);
    } else {
      return res.status(404).json({ message: 'No salespersons found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


module.exports = { createSalesperson, getSalespersonById, getAllSalespersons};