const mongoose = require('mongoose');
const { text } = require('body-parser');
mongoose.set('useCreateIndex', true);


// Schema for city
const citySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false,
    }
});

citySchema.index({ city: "text", description: "text",});
    

module.exports = mongoose.model('City', citySchema);