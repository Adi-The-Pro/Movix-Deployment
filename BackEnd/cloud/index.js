//Connecting our backend server to the clodinary cloud database
const cloudinary = require('cloudinary').v2;

//Connecting our server to the cloudinary, using credentials stored in .env file
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET,
    secure:true, //so that we get a secure url i.e. one having https:// and not just http://
});

module.exports = cloudinary;