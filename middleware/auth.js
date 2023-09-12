const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateUser(req, res, next) {
  // Get the token from the request header
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token and decode user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded.user;

    // Continue with the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid'});
  }
}

module.exports = authenticateUser;
