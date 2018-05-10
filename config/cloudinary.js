const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

var myStorage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'images',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, 'my-file-name');
  }
});


const uploadCloud = multer({ storage: myStorage });
module.exports = uploadCloud;
