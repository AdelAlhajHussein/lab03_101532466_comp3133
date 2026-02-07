const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
    {
        address: {
            building: String,
            street: String,
            zipcode: String
        },
        city: String,
        cuisine: String,
        name: String,
        restaurant_id: String
    },
    { collection: 'Restaurants' } // IMPORTANT: capital R
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
