const Review = require('../models/review');
const Movie = require('../models/movie');
const { isValidObjectId } = require('mongoose');
const { getAverageRatings } = require('../utlis/helper');

exports.addReview = async (req, res) => {
    const { movieId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id;
  
    if(!req.user.isVerified){
        res.status(404).json({error:"Please Verify Your Email First"});
    }
    if(!isValidObjectId(movieId)){
        return res.status(404).json({error:"Invalid Object ID"});
    }
    const movie = await Movie.findOne({ _id: movieId, status: "public" });
    if(!movie){
        return res.status(401).json({error:'Movie Not Found'});
    }
  
    const isAlreadyReviewed = await Review.findOne({
      owner: userId,
      parentMovie: movie._id,
    });
    if(isAlreadyReviewed){
        return res.status(401).json({error:"Invalid request, review is already their!"});
    }
  
    // create and update review.
    const newReview = new Review({owner: userId, parentMovie: movie._id, content,rating});
  
    // updating review for movie.
    movie.reviews.push(newReview._id);
    await movie.save();
  
    // saving new review
    await newReview.save();
  
    //Calculating new Average Rating For This Movie
    const reviews = await getAverageRatings(movie._id);

    res.json({ message: "Your review has been added.", reviews:reviews});
};

exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id;
  
    if (!isValidObjectId(reviewId)){
        return res.status(404).json({error:"Invalid Object ID"});
    }
    const review = await Review.findOne({ owner: userId, _id: reviewId });
    if (!review){
        return res.status(404).json({error:"Review not found!"});
    }
  
    review.content = content;
    review.rating = rating;

    await review.save();
    res.json({ message: "Your review has been updated." });
};
  
exports.removeReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;
  
    if (!isValidObjectId(reviewId)){
        return res.status(404).json({error:"Invalid Review ID"});
    }
  
    const review = await Review.findOne({ owner: userId, _id: reviewId });
    if (!review){
        return res.status(404).json({error:"Invalid Request, review not found"});
    }
  
    const movie = await Movie.findById(review.parentMovie).select("reviews");
    //Deleting the reviewId from the movie.review array
    movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);
  
    await Review.findByIdAndDelete(reviewId);   
    await movie.save();
  
    res.json({ message: "Review removed successfully." });
};

exports.getReviewsByMovie = async (req, res) => {
    const { movieId } = req.params;
  
    if (!isValidObjectId(movieId)){
        return res.status(404).json({error:"Invalid Movie Id"});
    }
  
    const movie = await Movie.findById(movieId)
    .populate({ path: "reviews", populate:{ path: "owner", select: "name",},})
    .select("reviews title");
  
    const reviews = movie.reviews.map((r) => {
      const { owner, content, rating, _id: reviewID } = r;
      const { name, _id: ownerId } = owner;
      return {id: reviewID,owner:{id:ownerId, name}, content, rating};
    });
    res.json({ movie: { reviews, title: movie.title } });
};
  