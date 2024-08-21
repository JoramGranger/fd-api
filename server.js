const express = require('express');
const connectDB = require('./config/db');
const rateLimit = require('./middleware/rateLimit');
const { swaggerUi, swaggerDocs } = require('./swagger');
const apiRoutes = require('./routes/apiRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// CORS Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            // Allow requests with no origin (like mobile apps or Postman)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

// Rate Limiting
app.use(rateLimit);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/', apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
