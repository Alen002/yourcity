var path = require('path');
const PORT = 5000;
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(morgan('short')); 

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, (err) => { 
    if (err) console.log("Error in server setup"); 
    console.log("Server listening on Port", PORT);
});


// Views path for finding the EJS templates
app.set('views', path.join(__dirname, '/client/views'));

// Test route
app.get('/test', (req, res) => {         
    res.send('express is working');
});

// Route for the main page
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Route for cities
app.get('/cities', (req, res) => {
    let cities = [
        {city: 'city', country: 'country', img: 'https://cdn.pixabay.com/photo/2013/01/13/21/48/eiger-74848_960_720.jpg'}
    ];
    res.render('cities.ejs', {cities});
});



