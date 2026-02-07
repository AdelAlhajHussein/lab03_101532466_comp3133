const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
    res.send('Restaurant Database API is running');
});

/**
 * STEP 4 + STEP 6
 * - /restaurants
 * - /restaurants?sortBy=ASC|DESC
 */
app.get('/restaurants', async (req, res) => {
    try {
        const sortBy = (req.query.sortBy || '').toUpperCase();

        // STEP 6: Selected columns + sorting
        if (sortBy === 'ASC' || sortBy === 'DESC') {
            const sortOrder = sortBy === 'ASC' ? 1 : -1;

            const restaurants = await Restaurant.find(
                {},
                { cuisine: 1, name: 1, city: 1, restaurant_id: 1 } // _id included by default
            ).sort({ restaurant_id: sortOrder });

            return res.json(restaurants);
        }

        // STEP 4: All columns
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * STEP 5
 * - /restaurants/cuisine/:cuisine
 */
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
    try {
        const cuisine = req.params.cuisine;
        const restaurants = await Restaurant.find({ cuisine: cuisine });
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * STEP 7
 * - /restaurants/Delicatessen
 * - cuisine = Delicatessen AND city != Brooklyn
 * - include only cuisine, name, city (exclude _id)
 * - sort by name ASC
 */
app.get('/restaurants/Delicatessen', async (req, res) => {
    try {
        const restaurants = await Restaurant.find(
            { cuisine: 'Delicatessen', city: { $ne: 'Brooklyn' } },
            { _id: 0, cuisine: 1, name: 1, city: 1 }
        ).sort({ name: 1 });

        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Helpful 404 (so you know the route truly doesn't exist)
app.use((req, res) => {
    res.status(404).send(`Route not found: ${req.method} ${req.originalUrl}`);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
