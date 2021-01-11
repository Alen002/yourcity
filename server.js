if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var path = require('path');
const PORT = process.env.PORT || 5000;
dotenv = require('dotenv').config();

const express = require('express');
methodOverride = require('method-override');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const sassMiddleware = require('node-sass-middleware');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('express-flash-messages');
/* const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');  */

// Import mongodb models
const City = require('./models/city');
const Comment = require('./models/comment');
const Review = require('./models/review');
const User = require('./models/user');

// middleware routes and functions
const checkdata = require('./routes/checkdata');
const cityroutes = require('./routes/cityroutes');
const {isLoggedIn} = require('./middleware');
const reviewroutes = require('./routes/reviewroutes');
const commentroutes = require('./routes/commentroutes');
const mapbox = require('./routes/mapbox');
/* const {storage} = require('./cloudinary/index'); */

// seeds.js file will run when the server starts
/* const seed = require('./models/seeds');  */
// If seed() runs then the commment id needs to be added manually to the city array
/* seed(); */

// MongoDb and mongoose
const mongoose = require('mongoose');
/* const url = 'mongodb://localhost/CityDB'; */
const url = process.env.MONGODB;

mongoose.connect(url, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false

});
const con = mongoose.connection;
con.on('open', () => console.log('Connected to mongodb'));

// Helmet content security policy
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://code.jquery.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "http://yourcities.herokuapp.com",
    "http://localhost:5000/script/script.js",   
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com/",
    "https://cloud.mongodb.com/"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// disable content security policy of helmet
/* app.use(
    helmet({
      contentSecurityPolicy: false,
    })
); */

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('short')); 
app.use(express.static('client'));
app.use(express.static('public'));
app.use(methodOverride('_method')); // for passing argument, eg. PUT, DELETE
app.use(expressSanitizer()); // for avoiding script injections
app.use(mongoSanitize()); // for avoiding sql injections

// Automatically pass currentUser to every view
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// USER SESSION AND AUTHENTIFICATION CONFIGURATION

/* const LocalStrategy = require('passport-local').Strategy; */

// User Session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Store sessions in the db
const store = new MongoStore({
    url: url,  // Production mode url is mongodb atlas, development mode is localhost
    secret: process.env.SECRETSESSION,
    touchAfter: 24 * 60 * 60 // Avoid unnecessary resaves/updates on the db                               
});

store.on('error', (e) => {
    console.log('some error with the SESSION STORE', e);
});

app.use(session ({
        store,
        name: '_ga',
        secret: process.env.SECRETSESSION,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            /* secure: true, */
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);

app.use(express.urlencoded({extended: true}));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 

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


/* const { reset } = require('nodemon'); */
const { resourceUsage } = require('process');
const comment = require('./models/comment');
const { authenticate } = require('passport');
const { response } = require('express');
app.use(cors());

app.listen(PORT, (err) => { 
    if (err) console.log("Error in server setup"); 
    console.log("Server listening on Port", PORT);
});

/********* MAIN ROUTES **********/
app.get('/', (req, res) => {
    res.render('main.ejs');
});
  
app.use(checkdata);
app.use(cityroutes);
app.use(commentroutes);
app.use(reviewroutes);
app.use(mapbox);

/********* Authentification routes *********/

// Signup Routes = Create a new user
app.get('/signup', (req, res) => {
    let errors = '';
    res.render('user/signup.ejs', {errors});
  });
  
  app.post('/signup', async (req, res, next) => {
    const {email, username, password} = req.body; // destructure the body request obtained from client/browser
    
    try {
        const user = new User({email, username});
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => { // req.login() automatic login
            if(err) {
                return next(err);
            } else {
                req.flash('success', ' Welcome!!!');
                res.redirect('/cities'); 
            }
        });
        
    }
    catch(err) { // error catching in case same user name is entered or other error appears
        User.findOne({username: username}, (err, user) => {
            if(user) {
                res.render('user/signup.ejs', {errors: 'User already exists'});
            } else {
                res.redirect('/cities');
            }
        });
    }
  });
  
  // Login Routes
  app.get('/login', (req, res) => {
    
    const flashMessages = res.locals.getMessages();  
    console.log('flash', flashMessages);
  
    if(flashMessages.error) {
        res.render('user/login.ejs', {errors: flashMessages.error});
    } else {
        let errors = ''; 
        res.render('user/login.ejs', {errors});
    }    
  });
  
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/cities',
    failureFlash: true
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
  
app.get('/userdata', (req, res) => {
   if(req.user) {
       res.send(req.user); 
   } else {
       res.send('user is not signed in');
   }    
});





