const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const publisherRoutes = require('./routes/publisherRoutes');
const bookRoutes = require('./routes/bookRoutes');
const salespersonRoutes = require('./routes/salespersonRoutes');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Port
const PORT = process.env.PORT || 8000;

// Routes
app.use('/api', publisherRoutes);
app.use('/api', bookRoutes);
app.use('/api', salespersonRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
