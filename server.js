const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const superCategoryRoutes = require('./routes/superCategoryRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const rateLimit = require('./middleware/rateLimit');
const config = require('config');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Rate Limiting
app.use(rateLimit);

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/super-categories', superCategoryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
