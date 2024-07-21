import client from "./client";
import { catchError, getToken } from "../utilis/helper";

//Add Review
export const addReview = async (movieId, reviewData) => {
    const token = getToken();
    try {
      const { data } = await client.post(`/review/add/${movieId}`, reviewData, {
        headers: {
          authorization: "Bearer " + token,
        },
      });
      return data;
    } catch (error) {
      return catchError(error);
    }
};

//Get Review
export const getReviewByMovie = async (movieId) => {
    try {
      const { data } = await client.get(`/review/get-reviews-by-movie/${movieId}`);
      return data;
    } catch (error) {
      return catchError(error);
    }
  };
  
//Delete Review
export const deleteReview = async (reviewId) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/review/${reviewId}`,{
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Update Review
export const updateReview = async (reviewId, reviewData) => {
  const token = getToken();
  try {
    const { data } = await client.patch(`/review/${reviewId}`, reviewData, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

  