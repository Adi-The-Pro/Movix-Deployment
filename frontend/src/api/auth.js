import client from "./client";

//SignUp
export const createUser = async (userInfo) => {
    try{
        const {data} = await client.post('/user/create',userInfo);
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error : error.message || error};
    }
}
//Verify Email
export const verifyUserEmail = async (userInfo) => {
    try{
        const {data} = await client.post('/user/verify-email',userInfo);
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error : error.message || error};
    }
}
//SignIn
export const signInUser = async (userInfo) => {
    try{
        const {data} = await client.post('/user/sign-in',userInfo);
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error : error.message || error};
    }
}
//isAuthorized
export const getIsAuth = async (token) => {
    try{
        const {data} = await client.get('/user/is-auth',{
            headers: {
                Authorization: 'Bearer ' + token,
                accept: 'application/json',
            }
        });
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error : error.message || error};
    }
}
//forget Password
export const forgetPassword = async (email) => {
    try{
        const {data} = await client.post('/user/forget-password',{email});
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error : error.message || error};
    }
}
//Verify Password Reset Token
export const verifyPasswordResetToken = async (token,userId) => {
    try{
        const {data} = await client.post('/user/verify-password-reset-token',{token,userId});
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error : error.message || error};
    }
}
//password reset
export const resetPassword = async (passwordInfo) => {
    try{
        const {data} = await client.post('/user/reset-password',passwordInfo);
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error : error.message || error};
    }
}
//Resend Email Verification Token
export const resendEmailVerificationToken = async (userId) => {
    try{
        const {data} = await client.post('/user/resend-email-verification-token',{userId});
        return data;
    }catch(error){
        const {response} = error;
        if(response?.data) return response.data;
        return {error : error.message || error};
    }
}