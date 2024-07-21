const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const { uploadTrailer, createMovie, updateMovieWithoutPoster,removeMovie, getMovies, getMovieForUpdate, updateMovie, searchMovies, getLatestUploads, getSingleMovie, getRelatedMovies, getTopRatedMovies, searchPublicMovies } = require("../controllers/movie");
const { parseData } = require("../utlis/helper");
const { validateMovie, validate, validateTrailer } = require("../middlewares/validator");

router.post("/upload-trailer",isAuth,isAdmin,uploadVideo.single("video"),uploadTrailer);
router.post(
  "/create",
  isAuth,isAdmin,uploadImage.single("poster"),parseData,
  validateMovie,validateTrailer,validate,
  createMovie
);

//We use patch when we don't want to change data completely
//If we are sending data as form-data and we don't use multer then we won't have the data in req.body
//That's why here we'll send data as raw-json from postman
//ONLY FOR REFERENCE
// router.patch( 
//   "/update-movie-without-poster/:movieId",
//   isAuth,
//   isAdmin,
//   // parseData,
//   validateMovie,
//   validate,
//   updateMovieWithoutPoster
// );

//If we are sending data as form-data and we don't use multer then we won't have the data in req.body
//After using multer middleware it will put the respective data in req.file and the rest in req.body
router.patch(
  "/update/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMovie
);

router.delete('/:movieId',isAuth,isAdmin,removeMovie)

router.get('/movies',isAuth,isAdmin,getMovies)

router.get('/for-update/:movieId',isAuth,isAdmin,getMovieForUpdate)

router.get('/search',isAuth,isAdmin,searchMovies) // '/search?name=shah' params



//For normal users
router.get('/latest-uploads',getLatestUploads);
router.get('/single/:movieId',getSingleMovie);
router.get('/related/:movieId',getRelatedMovies);
router.get('/top-rated',getTopRatedMovies); '/top-rated?type=abc type is optional'
router.get('/search-public',searchPublicMovies) // '/search?name=shah' params


module.exports = router;