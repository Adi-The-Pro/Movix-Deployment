//Multer is a middleware that is used to handle multiport/form-data , Here we are using multer to process image and video files
//These types of files can't be sent in req body directly
const multer = require('multer');
const storage = multer.diskStorage({}); //specify where to store the uploaded files.

// Multer allows you to specify a function to control which files are accepted for upload
const imageFileFilter = (req,file,cb) => {
    //req-request object .... file-the file being uploaded .... cb-callback function
    //it checks if the file's mimetype starts with "image"
    if(!file.mimetype.startsWith("image")){
        //error 
        cb("Supported only image files!",false);
    }
    //no error
    cb(null,true);
}

const videoFileFilter = (req,file,cb) => {
    //req-request object .... file-the file being uploaded .... cb-callback function
    //it checks if the file's mimetype starts with "video"
    if(!file.mimetype.startsWith("video")){
        //error 
        cb("Supported only image files!",false);
    }
    //no error
    cb(null,true);
}



//Middleware is exported as uploadImage,middleware is configured with the storage and fileFilter
//When we use this middleware it ensures only image files are accepted
exports.uploadImage = multer({storage,imageFileFilter});

//When we use this middleware it ensures only video files are accepted
exports.uploadVideo = multer({storage,videoFileFilter});