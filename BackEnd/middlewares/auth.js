const jwt = require('jsonwebtoken');
const User = require('../models/user');
//We are receiving the JWT token from the frontend in the request headers authorization
exports.isAuth = async (req,res,next) => {
    //Check if there there is token inside the request header 
    const token = req.headers?.authorization;
    if(!token) return res.status(404).json({error:'Invalid Token'});

    //The token will be of the format 'Bearer token'
    const jwtToken = token.split('Bearer ')[1];
    if(!jwtToken) return res.status(404).json({error:'Invalid Token'});
    
    //Now verify the JWT token and get the _userId from it 
    const {userId} = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY);
    
    //Now use this userId to find the user
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({error:"Unauthorized Access!"});
    }
    //Set this user in the request body which will be used later
    req.user = user;
    next(); 
}

exports.isAdmin = async (req,res,next) => {
    const {user}  = req;
    if(user.role !== 'admin'){
        return res.status(404).json({error:"Unauthorized Access!"})
    }
    next();
}