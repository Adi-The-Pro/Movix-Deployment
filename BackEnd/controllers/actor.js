const Actor = require('../models/actor');
const cloudinary = require('../cloud/index');
const { isValidObjectId } = require('mongoose');
const { uploadImageToCloud, formatActor } = require('../utlis/helper');


exports.createActor = async (req,res) => {
  //name, about, and gender of the actor can be conventionally fetched from the request body
  const {name,about,gender} = req.body;
  //Image of the actor can be feteched from the req.file
  const {file} = req;
  
  //Store the actorInfo in actor model(database)
  const newActor = new Actor({name,about,gender});

  //Only perform when the image is provided by the user
  if(file){
    const {public_id,url} = await uploadImageToCloud(file.path);
    //save this info into the database
    newActor.avatar = {url, public_id:public_id};
  }
  await newActor.save();

  //If there is no photo then don't send the url
  res.status(201).json({actor:formatActor(newActor)});
} 

exports.updateActor = async (req,res) => {
  //if we also have to update the image, then remove the old image from the cloud first
  const {name,about,gender} = req.body;
  const {file} = req;
  const {actorId} = req.params;

  //Check if the userId is valid ObjectId or not
  if(!isValidObjectId(actorId)){
    return res.status(401).json({error:'Invalid User Id'});
  }

  //Find Actor
  const actor = await Actor.findById(actorId);
  if(!actor){
    return res.status(401).json({error:'No Actor Found'});
  }
  const public_id = actor.avatar?.public_id;

  //Remove old image if there was one
  if(public_id && file){
    //delete the image from the cloud storage
    const {result} = await cloudinary.uploader.destroy(public_id);
    if(result !== 'ok'){
      return res.status(401).json({error:'Could not remove image from cloud!'});
    }
  }

  //Only perform when the image is provided by the user
  if(file){
    const {public_id,url} = await uploadImageToCloud(file.path);
    //save this info into the database
    actor.avatar = {url, public_id:public_id};
  }
  actor.name = name;
  actor.about = about;
  actor.gender = gender;
  await actor.save();

  res.status(201).json({actor:formatActor(actor)});
}

exports.removeActor = async (req,res) => {
  const {actorId} = req.params;
  //Check if the userId is valid ObjectId or not
  if(!isValidObjectId(actorId)){
    return res.status(401).json({error:'Invalid User Id'});
  }
  //Find Actor
  const actor = await Actor.findById(actorId);
  if(!actor){
    return res.status(401).json({error:'No Actor Found'});
  }
  const public_id = actor.avatar?.public_id;
  //Remove old image if there was one
  if(public_id){
    //delete the image from the cloud storage
    const {result} = await cloudinary.uploader.destroy(public_id);
    if(result !== 'ok'){
      return res.status(401).json({error:'Could not remove image from cloud!'});
    }
  }
  await Actor.findByIdAndDelete(actorId);
  return res.json({message:'Record removed successfully'});
}

exports.searchActor = async (req,res) => {
  const {query} = req;
  //We can do using indexing also...for reference
  // const result = await Actor.find({$text:{$search : `"${query.name}"`}});
  if(!query.name.trim()){
    return res.status(401).json({error:'Invalid Request'});
  }

  const result = await Actor.find({name :{$regex : query.name, $options:'i'}});
  const actors = result.map((actor) => formatActor(actor)); //result is an array 
  return res.json({results: actors}); //so that we get only relevant data, createdAt etc are removed
}

exports.getLatestActor = async (req,res) => {
  const result = await Actor.find().sort({createdAt: '-1'}).limit(12); //-1 for descending order 
  const actors = result.map((actor) => formatActor(actor)); //result is an array 
  return res.json(actors); //so that we get only relevant data, createdAt etc are removed
}

exports.getSingleActor = async (req,res) => {
  const {id} = req.params;
  //Check if the userId is valid ObjectId or not
  if(!isValidObjectId(id)){
    return res.status(401).json({error:'Invalid User Id'});
  }
  const actor = await Actor.findById(id);
  if(!actor){
    return res.status(404).json({error:'Actor not found'});
  }
  return res.json({actor:formatActor(actor)});
}


exports.getActors = async (req, res) => {
  const { pageNo, limit } = req.query;

  const actors = await Actor.find({})
    .sort({ createdAt: -1 }) //Sorting By Latest Time
    .skip(parseInt(pageNo) * parseInt(limit)) //Skipping the content 
    .limit(parseInt(limit)); //Selecting how much after skipping to send

  const profiles = actors.map((actor) => formatActor(actor));
  res.json({profiles,});
};