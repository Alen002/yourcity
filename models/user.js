const mongoose = require('mongoose');

// Schema for user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});
    
module.exports = mongoose.model('User', userSchema);