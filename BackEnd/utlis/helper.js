/*
    Callback-based functions are incompatible with promises & async/await because they are different 
    approaches to writing asynchronous code.
*/
const crypto = require('crypto');
const cloudinary = require('../cloud/index'); 

exports.generateRandomBytes = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(32,(err,buff) => {
            if(err) reject(err);
            const buffString = buff.toString('hex');
            resolve(buffString);
        });
    });
};

exports.handleNotFound = (req,res) => {
    return res.status(404).json({error: "Not Found"});
}

//This is used to upload an image to the cloudinary cloud database with cropping
exports.uploadImageToCloud = async (file) => {
    //It returns many things, we want:
    //secure_url --> url at which we can see the uploaded image  
    //public_id  --> unique used to identify the uploaded image in cloudinary
    const {public_id,secure_url} = await cloudinary.uploader.upload(file,{
        gravity: "face", height: 500, width:500, crop: "thumb" //cropping to save only face 
    }); 
    return {url:secure_url, public_id:public_id};
}

//So that everytime we get the detail of the actor from the backend it is in this format
exports.formatActor = (actor) => {
    const {name,gender,about,_id,avatar} = actor;
    return {id:_id, name, about, gender, avatar:avatar?.url}
}

//to convert incoming data from string to object
exports.parseData = (req,res,next) =>{
    const {trailer,cast,genres,tags,writers} = req.body;
    
    if(trailer) req.body.trailer = JSON.parse(trailer);
    if(cast) req.body.cast = JSON.parse(cast);
    if(genres) req.body.genres = JSON.parse(genres);
    if(tags) req.body.tags = JSON.parse(tags);
    if(writers) req.body.writers = JSON.parse(writers);
    next();
}

//Aggregation pipeline concept for calculating the average rating
exports.averageRatingPipeline = (movieId) => {
    return [
      {
        $lookup: {
          from: "Review",
          localField: "rating",
          foreignField: "_id",
          as: "avgRat",
        },
      },
      {
        $match: { parentMovie: movieId },
      },
      {
        $group: {
          _id: null,
          ratingAvg: {
            $avg: "$rating",
          },
          reviewCount: {
            $sum: 1,
          },
        },
      },
    ];
  };
  
//Selecting all the movies having the same tag
exports.relatedMovieAggregation = (tags, movieId) => {
    return [
      {
        $lookup: {
          from: "Movie",
          localField: "tags",
          foreignField: "_id",
          as: "relatedMovies",
        },
      },
      {
        $match: {
          tags: { $in: [...tags] },
          _id: { $ne: movieId },
        },
      },
      {
        $project: {
          title: 1,
          poster: "$poster.url",
          responsivePosters: "$poster.responsive",
        },
      },
      {
        $limit: 5,
      },
    ];
};

const Review = require('../models/review');
exports.getAverageRatings = async (movieId) => {
    const [aggregatedResponse] = await Review.aggregate(
      this.averageRatingPipeline(movieId)
    );
    const reviews = {};
  
    if (aggregatedResponse) {
      const { ratingAvg, reviewCount } = aggregatedResponse;
      reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
      reviews.reviewCount = reviewCount;
    }
  
    return reviews;
};

//To get the top-rated movies based on type
exports.topRatedMoviesPipeline = (type) => {
  const matchOptions = {
    reviews: { $exists: true },
    status: { $eq: "public" },
  };

  if (type) matchOptions.type = { $eq: type };
  return [
    {
      $lookup: {
        from: "Movie",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      $match: matchOptions,
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
};

