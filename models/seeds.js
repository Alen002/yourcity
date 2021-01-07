const mongoose = require('mongoose');
const City = require('./city');
const Comment = require('./comment');


const cities = [
    new City({
        city: 'New York',
        country: 'USA',
        images: 'https://cdn.pixabay.com/photo/2016/10/28/13/09/usa-1777986_960_720.jpg',
        author: '5fa7be03fcbe3a1b3ca3800d',
        comments: ['5fa7be03fcbe3a1b3ca3800d']  // manually added the id of the first commment 
    }),
    new City({
        city: 'Saigon',
        country: 'Vietnam',
        images: 'https://cdn.pixabay.com/photo/2018/11/21/08/08/saigon-3829005_960_720.jpg',
        author: '5fa7be03fcbe3a1b3ca3800d'
    }),
    new City ({
        city: 'Lisboa',
        country: 'Portugal',
        images: 'https://cdn.pixabay.com/photo/2020/02/05/09/31/city-4820579_960_720.jpg',
        author: '5fa7be03fcbe3a1b3ca3800d'
    }),
    new City ({
        city: 'Chiang Mai',
        country: 'Thailand',
        images: 'https://cdn.pixabay.com/photo/2016/09/15/01/57/chiang-mai-1670926_960_720.jpg',
        author: '5fa7be03fcbe3a1b3ca3800d'
    }),
    new City ({
        city: 'Singapore',
        country: 'Singapore',
        images: 'https://cdn.pixabay.com/photo/2017/04/11/03/41/singapore-2220473_960_720.jpg',
        author: '5fa7be03fcbe3a1b3ca3800d',
        Test: test
    }),
];

const comments = [
    new Comment ({
        user: 'Alen',
        comment: 'Nice City' 
    })
];

// Populate collections cities and comments with documents
const seeding = () => {
    cities.forEach((city) => {
        city.save();
    });
    comments.forEach((comment) => {
        comment.save();
    });
};

// It needs to be async otherwise population of db will not work
const seed = async () => {
    try {
        await City.deleteMany({});
        await Comment.deleteMany({});
        seeding();

    } catch(err) {
        console.log('Seeding dit not work');
    }
};

module.exports = seed;