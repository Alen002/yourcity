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
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose'); 

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


// USER SESSION AND AUTHENTIFICATION CONFIGURATION

// User Authentification
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if(err) {
                return done(err);
            }
            if(!user) {
                return done(null, false, {message: 'Incorrect username'});
            }
            /* if(!user.validPassword(password)) {
                return done(null, false, {message: 'Incorrect password'});
            } */ 
            return done(null, user);
        })
    }
)); 

// User Session
const session = require('express-session');
app.use(session ({
        secret: 'Do not tell anybody',
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

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
        console.log(cities);
        res.render('cities/index.ejs', {cities})
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
    res.render('cities/new.ejs');
});

// Display form to search for cities
app.get('/cities/search', (req, res) => {
    let citySearch = [];
    res.render('cities/search.ejs', {citySearch});
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
                res.render('cities/show.ejs', {cities})
            }); 
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
        res.render('cities/update.ejs', {cities});
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
app.get('/cities/:id/comments/new', async (req, res) => {
    try {
        const cities = await City.findById(req.params.id);
        res.render('comments/new.ejs', {cities});
    } 
    catch(err) {
        console.log('Something went wrong');
    }
});

// CREATE - Create a new comment and push it to the related city
app.post('/cities/:id/comments', async (req, res) => {
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

// Signup Routes
app.get('/signup', (req, res) => {
    let error = '';
    res.render('user/signup.ejs', {error});
});

app.post('/signup', (req, res) => {
    let body = req.body,
        username = body.username,
        email = body.email,
        password = body.password;
    User.findOne({username: username}, (err, user) => {
        if(err) {
            res.status(500).send('There has been an error');
        } else {
            if(user) {
                res.status(500).send('Username already exists');
            } else {
                let user = new User ();
                user.username = username;
                user.email = email;
                user.password = user.hashPassword(password);
                user.save((err, user) => {
                    if(err) {
                        res.status(500).send('Signup not successful');
                    } else {
                            /* passport.authenticate('local')((req, res) => {
                            res.redirect('/cities');
                        });  */
                        
                       res.redirect('/cities');
                    }
                });
            }
        } 
    });
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

app.get('/logout', (req, res) => {
    req.session.destroy( function ( err ) {
        res.send( { message: 'Successfully logged out' } );
    });
});

