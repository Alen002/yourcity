const PORT = 5000;
var path = require('path');
const express = require('express');
methodOverride = require('method-override');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const sassMiddleware = require('node-sass-middleware');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local');
/* const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');  */


// Import mongodb models
const City = require('./models/city');
const Comment = require('./models/comment');
const User = require('./models/user');

// seeds.js file will run when the server starts
const seed = require('./models/seeds'); 
// If seeds is run then the id of the commments need to be added manually to the city array
/* seed(); */

// MongoDb and mongoose
const mongoose = require('mongoose');
const url = 'mongodb://localhost/CityDB'
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
const con = mongoose.connection;
con.on('open', () => console.log('Connected to mongodb'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('short')); 
app.use(express.static('client'));
app.use(methodOverride('_method')); // for passing argument, eg. PUT, DELETE
app.use(expressSanitizer()); // for avoiding script injections

// Automatically pass currentUser to every view
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// USER SESSION AND AUTHENTIFICATION CONFIGURATION

/* const LocalStrategy = require('passport-local').Strategy; */

// User Session
const session = require('express-session');
app.use(session ({
        secret: 'Do not tell anybody',
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.urlencoded({extended: true}));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// SASS middleware
app.use(sassMiddleware({
    src: path.join(__dirname, '/client/styles'), // source directory to read the sass files from
    dest: path.join(__dirname, '/client/styles'), // write the generated sass files into the styles folder
}));

// Views path for finding the EJS templates
app.set('views', path.join(__dirname, '/client/views'));


const { reset } = require('nodemon');
const { resourceUsage } = require('process');
const comment = require('./models/comment');
const { authenticate } = require('passport');
const { response } = require('express');
app.use(cors());

app.listen(PORT, (err) => { 
    if (err) console.log("Error in server setup"); 
    console.log("Server listening on Port", PORT);
});


/**** START of ROUTES ****/

// Route for the main page
app.get('/', (req, res) => {
    res.render('main.ejs');
});

// INDEX - Display all city collections from the db
app.get('/cities', async (req, res) => {
    try {
        const cities = await City.find();
        /* console.log(cities); */
        res.render('cities/index.ejs', {cities, currentUser: req.user})
    }
    catch(err) {
    res.send('Cound not retrieve data');        
    }  
});

// CREATE - add new city to db
app.post('/cities', isLoggedIn, async (req, res) => {
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
app.get('/cities/new', isLoggedIn, (req, res) => {
    res.render('cities/new.ejs', {currentUser: req.user});
});

// Display form to search for cities
app.get('/cities/search', (req, res) => {
    let citySearch = [];
    res.render('cities/search.ejs', {citySearch, currentUser: req.user});
});

// Retrieve and display city based by user input
app.post('/cities/search', async (req, res) => {
    let city = req.body.searchCity;
    try {
        const citySearch = await City.find({$text: {$search: city}});
        res.render('cities/search.ejs', {citySearch});
    }
    catch(err) {
        res.send('There has been an error');
    }
});

// SHOW - Display details of a city and related user comments
app.get('/cities/:id', async (req, res) => {
    try {
        const cities = await City.findById(req.params.id)
            .populate('comments')
            .exec((err, cities) => {
                console.log(cities);
                res.render('cities/show.ejs', {cities, currentUser: req.user})
            }); 
    }
    catch(err) {
        res.send('Cound not retrieve data');        
    }   
});
  
// DELETE - Delete city 
app.delete('/cities/:id', isLoggedIn, async (req, res) => {
    try {
        const cities = await City.findByIdAndDelete(req.params.id)
        res.render('main.ejs');
    }
    catch(err) {
        res.send('Could not delete data');
    }  
});

// EDIT - Display edit form for a city
app.get('/cities/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const cities = await City.findById(req.params.id);
        console.log(cities);
        res.render('cities/update.ejs', {cities, currentUser: req.user});
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
        res.render('cities/index.ejs', {cities});
    }
    catch(err) {
        res.send('Something went wrong');
    }
});

// Show all comments
app.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json({comments});
        
    } 
    catch(err) {
        console.log('Cannot display comments');
    }
});

// NEW - Display form for entering a new comment
app.get('/cities/:id/comments/new', isLoggedIn, async (req, res) => { 
    try {
        const cities = await City.findById(req.params.id);
        res.render('comments/new.ejs', {cities, currentUser: req.user});
    } 
    catch(err) {
        console.log('Something went wrong');
    }
});

// CREATE - Create a new comment and push it to the related city
app.post('/cities/:id/comments', isLoggedIn, async (req, res) => {
    const comment = new Comment ({
        user: req.body.user = req.sanitize(req.body.user),
        comment: req.body.comment = req.sanitize(req.body.comment)
    });
    comment.save();
    try {
        const cities = await City.findById(req.params.id);
        cities.comments.push(comment); 
        cities.save();
         
        res.redirect('/cities');
    } catch(err) {
        res.send('Something went wrong while trying to save the comment to the db');
    }
}); 

/********* Authentification routes *********/

// Signup Routes = Create a new user
app.get('/signup', (req, res) => {
    let error = '';
    res.render('user/signup.ejs', {error});
});

app.post('/signup', async (req, res) => {
    const {email, username, password} = req.body; // destructuring the body request obtained from the client/browser
    const user = new User({email, username});
    const registerUser = await User.register(user, password);
    res.redirect('/cities'); 
});

// Login Routes
app.get('/login', (req, res) => {
    res.render('user/login.ejs');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/cities',
    failureRedirect: '/login'
}));
   
app.get('/profile', (req, res) => {
    res.send('You are now loged in');
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy( ( err ) => {
        res.redirect('/cities');
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};