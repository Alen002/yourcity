// https://github.com/affanshahid/multer-storage-cloudinary

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.NAME,
  api_key: process.env.API,
  secret_key: process.env.SECRET
});

// Instance of cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'CityImages', // The folder in cloudinary
  allowedFormats: ['png', 'jpg', 'jpeg']
});