import { catchError, getToken } from "../utilis/helper";
import client from "./client";

//Adding A New Actor To The Database
export const createActor = async (formData) => {
    const token = getToken();
    try{
        const {data} = await client.post('/actor/create',formData,
        {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type' : 'multipart/form-data'
            },
        });
        return data;
    }catch(error){
        return catchError(error);
    }
} 

//Adding A New Actor To The Database
//Passing the actor to be searched as name query
export const searchActor = async (query) => {
  const token = getToken();
  try {
    const { data } = await client(`/actor/search?name=${query}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
  
//Fetching Actors From The Backend To Display While Performing Pagination Logic
//By Sending pageNo and limit....in each page we will show limit actors and while fetching skip limit*pageNo actors
export const getActors = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client(`/actor/actors?pageNo=${pageNo}&limit=${limit}`,
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

//Updating Actors Info
export const updateActor = async (id, formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/actor/update/"+id, formData, {
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

//Delete Actor --> Added Just For Reference Not Implementing As Deleting Actor Could Get Complex
//As actor is begin used in mutiple palces
export const deleteActor = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete("/actor/" + id, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Getting Details For A Particular Actor
export const getActorProfile = async (id) => {
  try {
    const { data } = await client(`/actor/single/${id}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
