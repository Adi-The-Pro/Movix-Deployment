const cloudinary = require('../cloud/index');
const Movie = require('../models/movie');
const Review = require('../models/review');
const { isValidObjectId } = require('mongoose');
const { formatActor, averageRatingPipeline, relatedMovieAggregation, getAverageRatings, topRatedMoviesPipeline } = require('../utlis/helper');

exports.uploadTrailer = async (req,res) => {
    const {file} = req;
    if(!file)  return res.status(404).json({error:"Video file is missing!"});

    const {secure_url:url, public_id} = await cloudinary.uploader.upload(file.path,{resource_type:"video"});
    
    res.status(201).json({url,public_id});
}

exports.createMovie = async (req,res) => {
    const {file,body} = req;
    const {title, storyLine, director, releseDate, status, type, genres, tags, cast, writers, trailer, language } = body;
    
    const newMovie = new Movie({
        title,
        storyLine,
        releseDate,
        status,
        type,
        genres,
        tags,
        cast,
        trailer,
        language
    })
    
    //Check if the direcor is valid ObjectId or not
    if(!isValidObjectId(director)){
        return res.status(401).json({error:'Invalid director Id'});
    }
    newMovie.director = director;
    
    //Check if all the writers have valid ObjectId or not
    if(writers){
        for(let writerId of writers){
            if(!isValidObjectId(writerId)){
                return res.status(401).json({error:'Invalid writer Id'});
            }
        }
        newMovie.writers = writers;
    }

    
    //Uploading poster in resposive style
    if(file){
        const {secure_url:url,public_id,responsive_breakpoints} = await cloudinary.uploader.upload(
            file.path,{
                transformation:{
                    width : 1280,
                    height: 720,
                },
                responsive_breakpoints:{
                    create_derived: true,
                    max_width:640,
                    max_images:3    
                }
            }
        );
    
        const poster = {url,public_id,responsive:[]};
        const {breakpoints} = responsive_breakpoints[0]; 
        if(breakpoints.length){
            for(let imgObj of breakpoints){
                const {secure_url} = imgObj;
                poster.responsive.push(secure_url);    
            }
        }
        newMovie.poster = poster;
    }

    await newMovie.save();
    res.status(201).json({movie:{id:newMovie._id,title,}});
}


exports.updateMovieWithoutPoster = async(req,res) =>{
    const {title, storyLine, director, releseDate, status, type, genres, tags, cast, writers, trailer, 
    language} = req.body;
    const {movieId} = req.params;
    
    //Check if the movieId is valid ObjectId or not
    if(!isValidObjectId(movieId)){
        return res.status(401).json({error:'Invalid movie Id'});
    }

    //Find the movie whose details we want to update
    const movie = await Movie.findById(movieId);
    if(!movie){return res.status(404).json({error:'Movie Not Found!'});}

    movie.title = title;
    movie.storyLine = storyLine;
    movie.releseDate = releseDate;
    movie.status = status;
    movie.type = type;
    movie.genres = genres;
    movie.tags = tags;
    movie.cast = cast;
    movie.trailer = trailer;
    movie.language = language;

    //Checj if director Id is valid ObjectId or not
    if(!isValidObjectId(director)){
        return res.status(401).json({error:'Invalid director Id'});
    }
    movie.director = director;

    //Check if all the writers Id are valid ObjectId or not
    if(writers){
        for(let writerId of writers){
            if(!isValidObjectId(writerId)){
                return res.status(401).json({error:'Invalid writer Id'});
            }
        }
        movie.writers = writers;
    }

    await movie.save();
    return res.status(200).json({message:"Movie is updated successfully"});
}


exports.updateMovie = async (req,res) => {
    const {file} = req;

    const {title, storyLine, director, releseDate, status, type, genres, tags, cast, writers, trailer, 
    language } = req.body;
    const {movieId} = req.params;
    
    //Check if the movieId is valid ObjectId or not
    if(!isValidObjectId(movieId)){
        return res.status(401).json({error:'Invalid movie Id'});
    }

    //Find the movie whose details we want to update
    const movie = await Movie.findById(movieId);
    if(!movie){return res.status(404).json({error:'Movie Not Found!'});}

    movie.title = title;
    movie.storyLine = storyLine;
    movie.releseDate = releseDate;
    movie.status = status;
    movie.type = type;
    movie.genres = genres;
    movie.tags = tags;
    movie.cast = cast;
    movie.language = language;

    //Checj if director Id is valid ObjectId or not
    if(!isValidObjectId(director)){
        return res.status(401).json({error:'Invalid director Id'});
    }
    movie.director = director;

    //Check if all the writers Id are valid ObjectId or not
    if(writers){
        for(let writerId of writers){
            if(!isValidObjectId(writerId)){
                return res.status(401).json({error:'Invalid writer Id'});
            }
        }
        movie.writers = writers;
    }

    //update poster if there is any poster
    if(file){
        //removing poster from cloud if there is any
        const posterId = movie.poster?.public_id;
        if(posterId){
            const {result} = await cloudinary.uploader.destroy(posterId);
            console.log(result);
            if(result !== 'ok'){
              return res.status(401).json({error:'Could not update poster at the moment!'});
            }
        }
    
        //Uploading poster in resposive style
        const {secure_url:url,public_id,responsive_breakpoints} = await cloudinary.uploader.upload(
            req.file.path,{
                transformation:{
                    width : 1280,
                    height: 720,
                },
                responsive_breakpoints:{
                    create_derived: true,
                    max_width:640,
                    max_images:3
                }
            }
        );
    
        const poster = {url,public_id,responsive:[]};
        const {breakpoints} = responsive_breakpoints[0]; 
        if(breakpoints.length){
            for(let imgObj of breakpoints){
                const {secure_url} = imgObj;
                poster.responsive.push(secure_url);    
            }
        }
        movie.poster = poster;   
    }
    await movie.save();
    res.json({ message: "Movie is updated",
        movie: {
          id: movie._id,
          title: movie.title,
          poster: movie.poster?.url,
          genres: movie.genres,
          status: movie.status,
        },
    });
}


exports.removeMovie = async (req,res) => {
    const {movieId} = req.params;
    
    //Check if the movieId is valid ObjectId or not
    if(!isValidObjectId(movieId)){
        return res.status(401).json({error:'Invalid movie Id'});
    }

    //Find the movie whose details we want to update
    const movie = await Movie.findById(movieId);
    if(!movie){return res.status(404).json({error:'Movie Not Found!'});}


    //check if there is poster or not, if yes then remove it from the cloud storage
    const posterId = movie.poster?.public_id;
    if(posterId){
        const {result} = await cloudinary.uploader.destroy(posterId);
        if(result !== 'ok'){
          return res.status(401).json({error:'Could not remove poster at the moment!'});
        }
    }

    //check if there is trailer or not if yes then remove it from the cloud storage
    const trailerId = movie.trailer?.public_id;
    if(!trailerId) return res.status(404).json({error:'Coudld not find trailer in the cloud!'});
    if(trailerId){
        const {result} = await cloudinary.uploader.destroy(trailerId,{resource_type:'video'});
        if(result !== 'ok'){
          return res.status(401).json({error:'Could not remove trailer at the moment!'});
        }
    }
    await Movie.findByIdAndDelete(movieId);
    
    return res.status(202).json({message:'Movie removed successfully'});
}

exports.getMovies = async (req, res) => {
    const { pageNo = 0, limit = 10 } = req.query;
    const movies = await Movie.find({})
      .sort({ createdAt: -1 })
      .skip(parseInt(pageNo) * parseInt(limit))
      .limit(parseInt(limit));
  
    const results = movies.map((movie) => ({
      id: movie._id,
      title: movie.title,
      poster: movie.poster?.url,
      responsivePosters: movie.poster?.responsive,
      genres: movie.genres,
      status: movie.status,
    }));
  
    res.json({ movies: results });
}
  

exports.getMovieForUpdate = async (req, res) => {
    const { movieId } = req.params;

    if (!isValidObjectId(movieId)){
        return res.status(401).json({error:'Id is Invalid'});
    }

    //This way we will get all the data of the writers and directors from their _id
    const movie = await Movie.findById(movieId).populate(
        "director writers cast.actor"
    );

    res.json({
        movie: {id: movie._id,
        title: movie.title,
        storyLine: movie.storyLine,
        poster: movie.poster?.url,
        releseDate: movie.releseDate,
        status: movie.status,
        type: movie.type,
        language: movie.language,
        genres: movie.genres,
        tags: movie.tags,
        director: formatActor(movie.director),
        writers: movie.writers.map((w) => formatActor(w)),
        cast: movie.cast.map((c) => {
            return {
            id: c.id,
            profile: formatActor(c.actor),
            roleAs: c.roleAs,
            leadActor: c.leadActor,
            };
        }),
        },
    });
}

exports.searchMovies = async (req, res) => {
    const { title } = req.query;

    if (!title.trim()){
        return res.status(401).json({error:'Invalid title'});
    }
  
    const movies = await Movie.find({ title: { $regex: title, $options: "i" } });
    res.json({
      results: movies.map((m) => {
        return {
          id: m._id,
          title: m.title,
          poster: m.poster?.url,
          genres: m.genres,
          status: m.status,
        };
      }),
    });
}

//Get the 5 latest movie uploads to be shown in the slider in the frontend 
exports.getLatestUploads = async (req, res) => {
    const { limit = 5 } = req.query; //Not necessary
  
    const results = await Movie.find({ status: "public" }).sort("-createdAt").limit(parseInt(limit));
    const movies = results.map((m) => {
      return {
        id: m._id,
        title: m.title,
        storyLine: m.storyLine,
        poster: m.poster?.url,
        responsivePosters: m.poster.responsive,
        trailer: m.trailer?.url,
      };
    });
    res.json({ movies });
};
  
//Getting the detail of a single movie
exports.getSingleMovie = async (req, res) => {
    const { movieId } = req.params;
    if (!isValidObjectId(movieId)){
        return res.status(401).json({error:'Movie Id is Not Valid'});
    }
  
    const movie = await Movie.findById(movieId).populate("director writers cast.actor");
    
    //Calculating the average rating using the Review Model
    //Review(having parentMovie===movieId) --> calculate sum of rating and divide by total no of ratings
    //We could do this normally also, but here it is done using aggregation pipeline
    const [aggregatedResponse] = await Review.aggregate(averageRatingPipeline(movie._id));
    const reviews = {};
    if (aggregatedResponse) {
        const { ratingAvg, reviewCount } = aggregatedResponse;
        reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
        reviews.reviewCount = reviewCount;
    }
    
    // console.log(movie)

    const {_id: id,title,storyLine,cast,writers,director,releseDate,genres,tags,language,
      poster,
      trailer,
      type,
    } = movie;

    console.log(cast);
    //Sending all the data of this movie after formating it according to our usecase
    res.json({
      movie: {id, title, storyLine, releseDate, genres, tags, language, type,
        poster: poster?.url,
        trailer: trailer?.url,
        cast: cast.map((c) => ({
          id: c._id,
          profile: {
            id: c.actor?._id,
            name: c.actor?.name,
            avatar: c.actor?.avatar?.url,
          },
          leadActor: c.leadActor,
          roleAs: c.roleAs,
        })),
        writers: writers.map((w) => ({
          id: w?._id,
          name: w.name,
        })),
        director: {
          id: director?._id,
          name: director.name,
        },
        reviews: {...reviews}
      },
    });
};
  
//Getting the related movies using the tags we have stored for each movie
exports.getRelatedMovies = async (req, res) => {
    const { movieId } = req.params;
    if (!isValidObjectId(movieId)){
        return res.status(401).json({error:'Movie Id is Not Valid'});
    }
  
    const movie = await Movie.findById(movieId);
  
    const movies = await Movie.aggregate(
      relatedMovieAggregation(movie.tags, movie._id)
    );
  
    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);
      return {
        id: m._id,
        title: m.title,
        poster: m.poster,
        responsivePosters: m.responsivePosters,
        reviews: { ...reviews },
      };
    };
    const relatedMovies = await Promise.all(movies.map(mapMovies));
  
    res.json({ movies: relatedMovies });
};

//Getting Top Rated Movies By Finding the Average Of Each Movie
exports.getTopRatedMovies = async (req, res) => {
    const { type = "Film" } = req.query;
  
    const movies = await Movie.aggregate(topRatedMoviesPipeline(type));
  
    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);
      return {
        id: m._id,
        title: m.title,
        poster: m.poster,
        responsivePosters: m.responsivePosters,
        reviews: { ...reviews },
      };
    };
  
    const topRatedMovies = await Promise.all(movies.map(mapMovies));
  
    res.json({ movies: topRatedMovies });
};

//Searching Movies Normal Users
exports.searchPublicMovies = async (req, res) => {
    const { title } = req.query;
  
    if (!title.trim()){
        return res.status(404).json({error:"Invalid Request"});
    }
  
    const movies = await Movie.find({
      title: { $regex: title, $options: "i" },
      status: "public",
    });
  
    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);
      return { id: m._id, title: m.title, poster: m.poster?.url, reviews: { ...reviews },
        responsivePosters: m.poster?.responsive,
      };
    };
    const results = await Promise.all(movies.map(mapMovies));
  
    res.json({results});
  };
  
  


