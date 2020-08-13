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
    }
});

module.exports = mongoose.model('City', citySchema);