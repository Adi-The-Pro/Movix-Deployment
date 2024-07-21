const mongoose = require('mongoose');
const genres = require('../utlis/genres');

const {Schema} = mongoose;
const movieSchema  = new Schema({
    title:{
        type:String,
        trim:true,
        required:true,
    },
    storyLine:{
        type:String,
        trim:true,
        required:true,
    },
    director:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Actor",
    },
    releseDate:{
        type:Date,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum: ['public','private'], //only one these values will be allowed
    },
    type:{
        type:String,
        required:true,
    },
    genres:{
        type:[String],
        enum:genres,
    },
    tags:{
        type:[String],
        required:true,
    },
    //cast = [ {actor:ObjectId('123')}, roleAs:'Ethan', leadActor:true]
    cast:[
        {
            actor:{type:mongoose.Schema.Types.ObjectId, ref:"Actor"},
            roleAs:String,
            leadActor:Boolean
        },
    ],
    writers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Actor"
        },
    ],
    poster:{
        type:Object,
        url:{type:String, required:true},
        public_id:{type:String, required:true},
        responsive:[URL],
    },
    trailer:{
        type:Object,
        url:{type:String, required:true},
        public_id:{type:String, required:true},
        required:true,
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    language:{
        type:String,
        required:true
    },
},
{
    timestamps:true   
});

module.exports = mongoose.model('Movie', movieSchema);