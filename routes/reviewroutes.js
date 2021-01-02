const express = require('express');
const router = express.Router();

// Import mongodb models
const City = require('../models/city');
const Comment = require('../models/comment');
const User = require('../models/user');


router.post('/cities/:id/reviews', (req, res) => {
   
   
  let object = {
      review: req.body.review,
      rating: req.body.rating,
  }
  res.send(object);
});

module.exports = router;


