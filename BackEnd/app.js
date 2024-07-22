const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); //cross origin reference policy
require('dotenv').config() //seting up .env file
require('./db/index'); //Database connection

//For handling error in one place
require('express-async-errors');
const { errorHandler } = require('./middlewares/error');

const userRouter = require('./routes/user');
const actorRouter = require('./routes/actor');
const movieRouter = require('./routes/movie');
const reviewRouter = require('./routes/review');
const adminRouter = require('./routes/admin');

const { handleNotFound } = require('./utlis/helper');

const app = express(); 
app.use(cors())
app.use(express.json()); //so that our app can indentify JSON if it comes in request body(req.body)
app.use(morgan('combined')); //tells us the details of upcoming requests on app()

//Route Handlers
app.get('/',(req,res) => {
    return res.json({message:"Welcome from the backend"});
})
app.use('/api/user',userRouter); //user routes
app.use('/api/actor',actorRouter); //actor routes
app.use('/api/movie',movieRouter); //movie routes
app.use('/api/review',reviewRouter); //review routes
app.use('/api/admin',adminRouter); //admin routes
app.use('/*',handleNotFound) //in case the incoming request doesn't match with any route

//Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log("Backend Server Started On Port " + PORT);
});