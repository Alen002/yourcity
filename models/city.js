const mongoose = require('mongoose');
const { text } = require('body-parser');
mongoose.set('useCreateIndex', true);
const Comment = require('./comment');
const User = require('./user');



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

    geolocation: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
 
    images:   //image: { type: String, required: false},
        {
            type: String
            /* url: String,
            filename: String */
    },
    description: {
        type: String,
        required: false,
    },
    // Object referencing to User schema/model
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Object referencing to Comment schema/model
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
});

// Enable text based search 
citySchema.index({ city: "text", country: "text", image: "text", description: "text"});
    
module.exports = mongoose.model('City', citySchema);