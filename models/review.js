const mongoose = require('mongoose');
const { text } = require('body-parser');
mongoose.set('useCreateIndex', true);
const User = require('./user');


// Schema for reviews

const reviewSchema = new mongoose.Schema({
    review: { 
        type: String, 
        required: false
    }, 
    rating: {
        type: Number,
        required: false
    },
});

module.exports = mongoose.model('Review', reviewSchema);