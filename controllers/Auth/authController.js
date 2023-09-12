const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/Auth/user');
require('dotenv').config();
const Salespersons = require('../../models/Salespersons/salesperson');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign a JSON Web Token
    const payload = { user: { id: user.id, user_type: user.user_type } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (error, token) => {
      if (error) throw error;

      // Check if the user_type is "Salesperson"
      if (user.user_type === 'salesperson') {
        // Fetch the salesperson's team and include it in the response
        Salespersons.findOne({ where: { user_id: user.id } }).then((salesperson) => {
          if (salesperson) {
            res.json({ token, user_type: user.user_type, team: salesperson.team });
          } else {
            res.status(401).send('Access Denied');
          }
        });
      } else {
        // For other user types, send the token and user_type only
        res.json({ token, user_type: user.user_type });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;