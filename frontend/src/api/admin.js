import { catchError, getToken } from "../utilis/helper";
import client from "./client";

export const getAppInfo = async() =>{
    const token = getToken();
    try {
        const { data } = await client(`/admin/app-info`,{
        headers: {
            authorization: "Bearer " + token,
        },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }

}
export const getMostRatedMovies = async() =>{
    const token = getToken();
    try {
        const { data } = await client(`/admin/most-rated`,{
        headers: {
            authorization: "Bearer " + token,
        },
        });
        return data;
    } catch (error) {
        return catchError(error);
    }
}