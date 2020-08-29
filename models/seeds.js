const mongoose = require('mongoose');
const City = require('../models/city');
const Comment = require('../models/comment');
const { GridFSBucketWriteStream } = require('mongodb');



const cities = [
    new City({
        city: 'New York',
        country: 'USA',
        image: 'https://cdn.pixabay.com/photo/2016/10/28/13/09/usa-1777986_960_720.jpg' 
    }),
    new City({
        city: 'Saigon',
        country: 'Vietnam',
        image: 'https://cdn.pixabay.com/photo/2018/11/21/08/08/saigon-3829005_960_720.jpg'
    }),
    new City ({
        city: 'Lisboa',
        country: 'Portugal',
        image: 'https://cdn.pixabay.com/photo/2020/02/05/09/31/city-4820579_960_720.jpg'
    }),
    new City ({
        city: 'Chiang Mai',
        country: 'Thailand',
        image: 'https://cdn.pixabay.com/photo/2016/09/15/01/57/chiang-mai-1670926_960_720.jpg'
    }),
    new City ({
        city: 'Singapore',
        country: 'Singapore',
        image: 'https://cdn.pixabay.com/photo/2017/04/11/03/41/singapore-2220473_960_720.jpg'
    }),
];

const comments = [
    new Comment ({
        user: 'kdflgjdfklgjdsklfgjdfksl',
        comment: 'kdflgjdfklgjdfklgjdfkl' 
    }),
    new Comment ({
        user: 'kdflgjdfklgjdsklfgjdfksl',
        comment: 'kdflgjdfklgjdfklgjdfkl' 
    })
];

// Populate collections cities and comments with documents
cities.forEach((city) => {
    city.save();
});

comments.forEach((comment) => {
    comment.save();
});