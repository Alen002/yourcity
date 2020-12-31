// https://github.com/affanshahid/multer-storage-cloudinary

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.NAME,
  api_key: process.env.API,
  api_secret: process.env.SECRET
});

// Instance of cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'CityImages',
    allowedFormats: ['png', 'jpg', 'jpeg']
  }
});

module.exports = {
  cloudinary,
  storage
}
