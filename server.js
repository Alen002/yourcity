var path = require('path');
const PORT = 5000;
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const City = require('./models/city');

// MongoDb and mongoose
const mongoose = require('mongoose');
const url = 'mongodb://localhost/CityDB'
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
const con = mongoose.connection;
con.on('open', () => console.log('Connected to mongodb'));


app.use(express.json());
app.use(morgan('short')); 

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, (err) => { 
    if (err) console.log("Error in server setup"); 
    console.log("Server listening on Port", PORT);
});

// Views path for finding the EJS templates
app.set('views', path.join(__dirname, '/client/views'));

// Array in which data inputed by the user is saved
let cities = [
    {city: 'city', country: 'country', image: 'https://cdn.pixabay.com/photo/2013/01/13/21/48/eiger-74848_960_720.jpg'},
    {city: 'city2', country: 'USA', image: 'https://cdn.pixabay.com/photo/2016/12/15/07/54/horseshoe-bend-1908283__340.jpg'}
]; 

// Test route
app.get('/test', (req, res) => {         
    res.send('express is working');
});

// Route for the main page
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Route for displaying cities
app.get('/cities', (req, res) => {
    res.render('cities.ejs', {cities});
});

// Route to display the page for entering a new city
app.get('/cities/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/cities', async(req, res) => {
    const city = new City ({
        city: req.body.city,
        country: req.body.country
    });

    try {
        const addData = await city.save();
        res.json(addData);
    }
    catch(err) {
        res.send('Error: Could not save city');
    }

});