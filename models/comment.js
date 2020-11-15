const mongoose = require('mongoose');
const { text } = require('body-parser');
mongoose.set('useCreateIndex', true);
const User = require('./user');

// Schema for user comments
const commentSchema = new mongoose.Schema({
    
    date: { 
        type: Number, 
        default: new Date()
    }, 
    user: {
        type: String,
        required: true
    },
    // Object referencing to User schema/model
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    }      
});

// Enable text based search 
commentSchema.index({ comment: "text"});

module.exports = mongoose.model('Comment', commentSchema);




