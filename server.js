const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const rateLimit = require('./middleware/rateLimit');
const config = require('config');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Rate Limiting
app.use(rateLimit);

// Define Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
