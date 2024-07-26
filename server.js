const express = require('express');
const connectDB = require('./config/db');
const rateLimit = require('./middleware/rateLimit');
const { swaggerUi, swaggerDocs } = require('./swagger');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Rate Limiting
app.use(rateLimit);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define Routes
app.use('/', apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
