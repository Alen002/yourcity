const express = require('express');
const router = express.Router();

// Import mongodb models
const City = require('../models/city');
const Review = require('../models/review');
const User = require('../models/user');

const { isLoggedIn } = require('../middleware');

// CREATE - Create a new review and push it to the related city
router.post('/cities/:id/reviews', isLoggedIn, async (req, res) => {
  const review = new Review ({
      review: req.sanitize(req.body.review),
      rating: req.sanitize(req.body.rating)
  });
  review.save();
  try {
      const cities = await City.findById(req.params.id);
      cities.reviews.push(review); 
      cities.save();
       
      res.redirect('/cities');
  } catch(err) {
      res.send('Something went wrong while trying to save the comment to the db');
  }
}); 

// Just for testing purposes
/* router.post('/cities/:id/reviews', (req, res) => {   
  let object = {
      review: req.body.review,
      rating: req.body.rating,
  }
  res.send(object);
}); */

module.exports = router;


