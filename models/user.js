const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');

// Schema for user
const userSchema = new mongoose.Schema({
    /* username: {
        type: String,
        required: true
    }, */
    email: {
        type: String,
        required: true,
        unique: true
    }/* ,
    password: {
        type: String,
        required: true
    } */
});

// Password Hashing
/* userSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = (password, user) => {   
   return bcrypt.compareSync(password, user);
}; */

userSchema.plugin(passportLocalMongoose);  
module.exports = mongoose.model('User', userSchema);
