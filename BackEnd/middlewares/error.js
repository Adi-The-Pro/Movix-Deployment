exports.errorHandler = (err,req,res,next) => {
/*This is done to catch errors inside all async-await func in our app(), so instead of writing try()-catch()
for all async-await func ,we'll just require 'express-async-errors' module which will catch error in our app()
and return it to front-end without crashing the whole app().So,we dont't have to write try()-catch() for any async func*/    
    res.status(500).json({error: err.message || err});
}