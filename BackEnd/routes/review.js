const express = require('express');
const { isAuth } = require('../middlewares/auth');
const { validateRatings, validate } = require('../middlewares/validator');
const { addReview, updateReview,removeReview, getReviewsByMovie } = require('../controllers/review');
const router = express.Router();

//Add Review
router.post('/add/:movieId',isAuth,validateRatings,validate,addReview)

//Update Review
router.patch('/:reviewId',isAuth,validateRatings,validate,updateReview)

//Delete Review
router.delete('/:reviewId',isAuth,removeReview)

//Get Review For Any Movie
router.get('/get-reviews-by-movie/:movieId',getReviewsByMovie);

module.exports = router;
 