const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const User = require('../../models/Auth/user');
const Publisher = require('../../models/Publishers/publisher');

// Create a new publisher and user
const createPublisher = async (req, res) => {
  const { company_name, email, address, contact_person, phone_number, country, state, city, postal_code, password } = req.body;

  try {
    // Check if the user is an admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 11);

    // Create the user in the Users table
    const user = await User.create({
      email: email,
      password: hashedPassword,
      user_type: 'publisher',
    });


    if (!user || !user.id) {
      return res.status(500).json({ message: 'User creation failed' });
    }

    // Create the publisher using the user's ID
    const publisher = await Publisher.create({
      user_id: user.id,
      company_name,
      email,
      address,
      contact_person,
      phone_number,
      country,
      state,
      city,
      postal_code,
    });

    res.status(201).json(publisher);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Function to fetch publisher data (accessible to admin and publisher)
const getPublisherData = async (req, res) => {
  try {
    const publisherId = req.user.publisher_id; // Get publisher_id from the logged-in user

    // Check if the user is an admin or a publisher
    if (req.user.user_type === 'publisher') {
      // Find the publisher data by publisher_id
      const publisher = await Publisher.findByPk(publisherId);

      if (publisher) {
        return res.status(200).json(publisher);
      } else {
        return res.status(404).json({ message: 'Publisher data not found' });
      }
    } else {
      return res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Function to update publisher data (accessible to admin only)
const updatePublisherData = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const publisherId = req.params.publisherId; // Get publisherId from request params
    const updatedData = req.body; // The updated publisher data

    // Find the publisher by ID and update it
    const [updatedRows] = await Publisher.update(updatedData, {
      where: { id: publisherId },
    });

    if (updatedRows > 0) {
      // The update was successful
      return res.status(200).json({ message: 'Publisher data updated successfully' });
    } else {
      return res.status(404).json({ message: 'Publisher not found' });
    }
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Function to fetch all publishers (accessible to admin only)
const getAllPublishers = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Fetch all publishers
    const publishers = await Publisher.findAll();

    if (publishers.length > 0) {
      return res.status(200).json(publishers);
    } else {
      return res.status(404).json({ message: 'No publishers found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

module.exports = { createPublisher, getPublisherData, updatePublisherData, getAllPublishers };