const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const {Schema} = mongoose;
const userSchema  = new Schema({
    name:{
        type:String,
        trim:true, //removes unwanted spaces from front and back
        required:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
        required:true,
    },
    role:{
        type:String,
        required:true,
        default:'user',
        enum:['admin','user'] //only one these values will be allowed
    }
});

//This will run everytime newUser.save() will take place in user.js(controller)
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const hashPassword = await bcrypt.hash(this.password,10);
        this.password = hashPassword;
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
};

module.exports = mongoose.model('User', userSchema);