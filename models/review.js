const mongoose = require('mongoose');
const { text } = require('body-parser');
mongoose.set('useCreateIndex', true);
const User = require('./user');


// Schema for reviews
const reviewSchema = new mongoose.Schema({
    date: { 
        type: Number, 
        default: new Date()
    }, 
    review: { 
        type: String, 
        required: false
    }, 
    rating: {
        type: Number,
        required: false
    },
    // Object referencing to User schema/model
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', reviewSchema);