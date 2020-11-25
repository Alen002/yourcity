const express = require('express');
const router = express.Router();

// Import mongodb models
const City = require('../models/city');
/* const Comment = require('../models/comment');
const User = require('../models/user'); */

router.get('/allcities', async (req, res) => {   
  try {
      let getData = await City.find({}, {city: 1});       
      res.json(getData);                 
  }
  catch(err) {
      console.log('Could not fetch data');
  }    
});

router.get('/citycomments', async (req, res) => { 
  try {
      let getData = await City.find({}).populate({path: 'comments', select: 'comment'});
      res.json(getData);                 
  }
  catch(err) {
      console.log('Could not fetch data');
  }    
});

router.get('/commentsauthor', async (req, res) => { 
  try {
      let getData = await City.find({}).populate({
          path: "comments", // populate comments
          populate: {
             path: "author" // in comments, populate author
          }
       })
      res.json(getData);                 
  }
  catch(err) {
      console.log('Could not fetch data');
  }    
});

router.get('/test', (req, res) => {
    res.send('This is a test');
});

module.exports = router;

