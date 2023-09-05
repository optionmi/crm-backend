const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const publisherRoutes = require('./routes/publisherRoutes');
const bookRoutes = require('./routes/bookRoutes');
const salespersonRoutes = require('./routes/salespersonRoutes');
const cors = require('cors');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up CORS origin
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};


// Use CORS
app.use(cors(corsOptions));

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
