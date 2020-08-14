const mongoose = require('mongoose');

// Schema for city
const citySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('City', citySchema);