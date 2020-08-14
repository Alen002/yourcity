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

// Route for the main page
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Route for retrieving and displaying city collections in City from mongodb
app.get('/cities', async(req, res) => {
    try {
        const cities = await City.find();
        console.log(cities);
        res.render('cities.ejs', {cities})
    }
    catch(err) {
    res.send('Cound not retrieve data');        
    }
    
});

// Save data to mongodb
app.post('/cities', async (req, res) => {
    const city = new City ({
        city: req.body.city,
        country: req.body.country,
        image: req.body.image,
        description: req.body.description
    });

    try {
        const addData = await city.save();
        res.json(addData);
    }
    catch(err) {
        res.send('Error: Could not save city');
    }
});

// Route to display the page for entering a new city
app.get('/cities/new', (req, res) => {
    res.render('new.ejs');
});

// Display form to search for city
app.get('/cities/search', (req, res) => {
    let citySearch = [];
    res.render('search.ejs', {citySearch});
});

// Retrieve and display city based by user input
app.post('/cities/search', async (req, res) => {
    let city = req.body.searchCity;
    try {
        const citySearch = await City.find({$text: {$search: city}});
        res.render('search.ejs', {citySearch});
    }
    catch(err) {
        res.send('There has been an error');
    }
});

