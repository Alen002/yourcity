const mongoose = require('mongoose');
const { text } = require('body-parser');
mongoose.set('useCreateIndex', true);

// Schema for user comments
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    }
      
});

// Enable text based search 
commentSchema.index({ comment: "text"});

module.exports = mongoose.model('Comment', commentSchema);




