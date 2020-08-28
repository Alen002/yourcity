const PORT = 5000;
var path = require('path');
const express = require('express');
methodOverride = require('method-override');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const sassMiddleware = require('node-sass-middleware');
const expressSanitizer = require('express-sanitizer');
const City = require('./models/city');
const Comment = require('./models/comment');

// MongoDb and mongoose
const mongoose = require('mongoose');
const url = 'mongodb://localhost/CityDB'
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
const con = mongoose.connection;
con.on('open', () => console.log('Connected to mongodb'));


app.use(express.json());
app.use(morgan('short')); 
app.use(express.static('client'));
app.use(methodOverride('_method')); // for passing argument, eg. PUT, DELETE
app.use(expressSanitizer()); // for avoiding script injections

// SASS middleware
app.use(sassMiddleware({
    src: path.join(__dirname, '/client/styles'), // source directory to read the sass files from
    dest: path.join(__dirname, '/client/styles'), // write the generated sass files into the styles folder
}));

// Views path for finding the EJS templates
app.set('views', path.join(__dirname, '/client/views'));

const bodyParser = require('body-parser');
const { reset } = require('nodemon');
const { resourceUsage } = require('process');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, (err) => { 
    if (err) console.log("Error in server setup"); 
    console.log("Server listening on Port", PORT);
});


// Route for the main page
app.get('/', (req, res) => {
    res.render('main.ejs');
});

// INDEX - Display all city collections from the db
app.get('/cities', async(req, res) => {
    try {
        const cities = await City.find();
        console.log(cities);
        res.render('index.ejs', {cities})
    }
    catch(err) {
    res.send('Cound not retrieve data');        
    }  
});

// CREATE - add new city to db
app.post('/cities', async (req, res) => {
    const city = new City ({
        city: req.body.city= req.sanitize(req.body.city),
        country: req.body.country = req.sanitize(req.body.country),
        image: req.body.image = req.sanitize(req.body.image),
        description: req.body.description = req.sanitize(req.body.description)
    });

    try {
        const addData = await city.save();
        res.json(addData);
    }
    catch(err) {
        res.send('Error: Could not save city');
    }
});

// NEW - Display form to create a new city
app.get('/cities/new', (req, res) => {
    res.render('new.ejs');
});

// Display form to search for cities
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


// SHOW - Display details of a city
app.get('/cities/:id', async (req, res) => {
    try {
        const cities = await City.findById(req.params.id);
        console.log(cities);
        res.render('show.ejs', {cities})
    }
    catch(err) {
        res.send('Cound not retrieve data');        
    }   
});
  
// DELETE - Delete city 
app.delete('/cities/:id', async (req, res) => {
    try {
        const cities = await City.findByIdAndDelete(req.params.id)
        res.render('main.ejs');
    }
    catch(err) {
        res.send('Could not delete data');
    }  
});

// EDIT - Display edit form for a city
app.get('/cities/:id/edit', async (req, res) => {
    try {
        const cities = await City.findById(req.params.id);
        console.log(cities);
        res.render('update.ejs', {cities});
    } 
    catch(err) {
        res.send('Something went wrong');
    }
});

// UPDATE - After changes update/save changes for a city
app.put('/update/:id', async (req, res) => {
    try {
        const update = await City.findByIdAndUpdate(req.params.id, {
            city: req.body.city= req.sanitize(req.body.city),
            country: req.body.country = req.sanitize(req.body.country),
            image: req.body.image = req.sanitize(req.body.image),
            description: req.body.description = req.sanitize(req.body.description)
        });

        const cities = await City.find();
        console.log(cities);
        res.render('index.ejs', {cities});
    }
    catch(err) {
        res.send('Something went wrong');
    }
});



