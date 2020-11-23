const express = require('express');
const router = express.Router();

// Import mongodb models
const City = require('../models/city');
const Comment = require('../models/comment');
const User = require('../models/user');

const { isLoggedIn } = require('../middleware');

// Show all comments
router.get('/comments', async (req, res) => {
  try {
      const comments = await Comment.find().populate('author');
      res.json({comments});
      
  } 
  catch(err) {
      console.log('Cannot display comments');
  }
});

// NEW - Display form for entering a new comment
router.get('/cities/:id/comments/new', isLoggedIn, async (req, res) => { 
  try {
      const cities = await (await City.findById(req.params.id));
      res.render('comments/new.ejs', {cities, currentUser: req.user});
  } 
  catch(err) {
      console.log('Something went wrong');
  }
});

// CREATE - Create a new comment and push it to the related city
router.post('/cities/:id/comments', isLoggedIn, async (req, res) => {
  const comment = new Comment ({
      comment: req.body.comment = req.sanitize(req.body.comment),
      author: req.user._id
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

module.exports = router;