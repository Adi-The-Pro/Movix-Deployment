const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const passwordResetSchema = new Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    createAt:{
        type:Date,
        expires:3600,
        default: Date.now,
    }
});

passwordResetSchema.pre('save',async function(next){
    if(this.isModified('token')){
        const hashToken = await bcrypt.hash(this.token,10);
        this.token = hashToken;
    }
    next();
});
passwordResetSchema.methods.compareTokens = async function(OTP){
    const result = await bcrypt.compare(OTP,this.token);
    return result;
}

module.exports = mongoose.model('PasswordResetToken',passwordResetSchema);