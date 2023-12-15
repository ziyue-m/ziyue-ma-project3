require('dotenv').config(); // Adding dotenv to load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const statusUpdateRoutes = require('./routes/statusUpdateRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.json());

// Connect to MongoDB
const mongoDBEndpoint = process.env.MONGODB_URI;
mongoose.connect(mongoDBEndpoint, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/statusUpdates', statusUpdateRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
