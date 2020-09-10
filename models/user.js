const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Schema for user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);
    
module.exports = mongoose.model('User', userSchema);