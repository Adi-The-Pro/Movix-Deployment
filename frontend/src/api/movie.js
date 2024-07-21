import { catchError, getToken } from "../utilis/helper";
import client from "./client";

//Uploading Trailer To Backend(Cloudinary) And then Getting Url From there
export const uploadTrailer = async (formData,onUploadProgress) => {
    const token = getToken();
    try{
        const {data} = await client.post('/movie/upload-trailer',formData,
        {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type' : 'multipart/form-data'
            },
            // onUploadProgress tells how much of the total data is loaded which we are then passing into the 
            // callback function(setUploadProgress) 
            //frontend to backend ---> it is tracking this 
            //backend to cloudinary ---> not for this
            onUploadProgress: ({loaded,total}) => {
                if(onUploadProgress){
                    const val = Math.floor((loaded/total)*100);
                    onUploadProgress(val);
                }
            }
        });
        return data;
    }catch(error){
        return catchError(error);
    }
} 

//Uploading All the movie information along with trailer url
export const uploadMovie = async (formData) => {
    const token = getToken();
    try {
      const { data } = await client.post("/movie/create", formData, {
        headers: {
          authorization: "Bearer " + token,
          "content-type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      return catchError(error);
    }
};

//Fetching Movies From The Backend To Display While Performing Pagination Logic
//By Sending pageNo and limit....in each page we will show limit actors and while fetching skip limit*pageNo actors
export const getMovies = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client(`/movie/movies?pageNo=${pageNo}&limit=${limit}`,
      {
        headers: {
          authorization: "Bearer " + token,
          "content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Fetching All of the data of movie using its movie Id From The Backend To Display While Performing Movie Update
export const getMovieForUpdate = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.get("/movie/for-update/" + id, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Updating Movie Data 
export const updateMovie = async (id, formData) => {
  const token = getToken();
  try {
    const { data } = await client.patch("/movie/update/" + id, formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Delete A Movie
export const deleteMovie = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/movie/${id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};


//Searching A Movie
export const searchMovieForAdmin = async (title) => {
  const token = getToken();
  try {
    const { data } = await client(`/movie/search?title=${title}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Fetcging Top Rated Movies
export const getTopRatedMovies = async(type,signal) => {
  try {
    let endPoint = '/movie/top-rated';
    if(type) endPoint = endPoint + '?type='+type;
    const { data } = await client(endPoint,{signal});
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Fetcging Latest Uploaded Movies
export const getLatestUploads = async(signal) => {
  try {
    const { data } = await client('/movie/latest-uploads',{signal});
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Fetcging Single Movie
export const getSingleMovie = async(id)=>{
  try {
    const { data } = await client('/movie/single/'+id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Get Related Movies
export const getRelatedMovies = async(id)=>{
  try {
    const { data } = await client('/movie/related/'+id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Search Movie Normal Users
export const searchPublicMovies = async(title)=>{
  try {
    const { data } = await client('/movie/search-public?title='+title);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

