const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// Import mongodb models
const City = require('../models/city');
const Comment = require('../models/comment');
const User = require('../models/user');

const { isLoggedIn } = require('../middleware');


// INDEX - Display all city collections from the db
router.get('/cities', async (req, res) => {
    try {
        const cities = await City.find().populate('author');  // user reference in city schema is populated with user data
        /* console.log(cities); */
        res.render('cities/index.ejs', {cities, currentUser: req.user})
    }
    catch(err) {
    res.send('Cound not retrieve data');        
    }  
});

// Display form to search for cities
router.get('/cities/search', (req, res) => {
    let citySearch = [];
    res.render('cities/search.ejs', {citySearch, currentUser: req.user});
});

// Retrieve and display city based on user input
router.post('/cities/search', async (req, res) => {
    let city = req.body.searchCity;
    try {
        const citySearch = await City.find({$text: {$search: city}});
        res.render('cities/search.ejs', {citySearch});
    }
    catch(err) {
        res.send('There has been an error');
    }
});

// SHOW - Display city details and related user comments
router.get('/cities/:id', async (req, res) => {
    try {
        const cities = await City.findById(req.params.id)
            .populate({path: 'comments', populate: {path: 'author'}})
            .populate('author')

           /*  .exec((err, cities) => {
                console.log(cities);
                res.render('cities/show.ejs', {cities, currentUser: req.user})
            }); */ 
            res.render('cities/show.ejs', {cities, currentUser: req.user});
    }
    catch(err) {
        res.send('Cound not retrieve data');        
    }   
});

/* Routes for manipulating data */
// NEW - Display form to create a new city
router.get('/new', isLoggedIn, (req, res) => {
    res.render('cities/new.ejs', {currentUser: req.user} );
    /* res.render('cities/new.ejs'); */
});

// CREATE - add new city to db
router.post('/city/new', upload.single('image'), isLoggedIn, async (req, res) => {  //upload.single() we get one file
    console.log('this is the file', req.file); 
    const city = new City ({
         city: req.body.city= req.sanitize(req.body.city),
         country: req.body.country = req.sanitize(req.body.country),
         image: req.body.image = req.file.path,   //req.sanitize(req.body.image)
         author: req.user._id, // derived from currentUser
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


// DELETE - Delete city 
router.delete('/cities/:id', isLoggedIn, async (req, res) => {
    try {
        const cities = await City.findByIdAndDelete(req.params.id)
        res.render('main.ejs');
    }
    catch(err) {
        res.send('Could not delete data');
    }  
});

// EDIT - Display edit form for a city
router.get('/cities/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const cities = await City.findById(req.params.id);  
        console.log(req.user._id)
        res.render('cities/update.ejs', {cities, currentUser: req.user});
    }
    catch(err) {
        res.send('Something went wrong');
    }
});

// UPDATE - After changes update/save changes for a city
router.put('/update/:id', isLoggedIn, async (req, res) => {
    try {
        const update = await City.findByIdAndUpdate(req.params.id, {
            city: req.body.city= req.sanitize(req.body.city),
            country: req.body.country = req.sanitize(req.body.country),
            image: req.body.image = req.sanitize(req.body.image),
            description: req.body.description = req.sanitize(req.body.description)
        }); 
        const cities = await City.find();
        console.log(cities);
        res.render('cities/index.ejs', {cities});
    }
    catch(err) {
        res.send('Something went wrong');
    }
});



module.exports = router;