const jwt = require('jsonwebtoken');
const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const PasswordResetToken = require("../models/passwordResetToken");
const {isValidObjectId} = require('mongoose');
const {generateOTP, generateMailTransporter} = require("../utlis/mail");
const { generateRandomBytes } = require("../utlis/helper");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  //Check if user already exists
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(401).json({ error: "User already exists" });
  }
  //Else if it is a new user add it to the database
  const newUser = new User({ name, email, password });
  await newUser.save();

  //Create A 5-Digit OTP For Verification
  let OTP = generateOTP();
  //Store This OTP In EmailVerficationToken Collection(Model) With Hashing Which Will Expire After 1hour
  const newEmailVerficationToken = new EmailVerificationToken({owner: newUser._id,token: OTP});
  await newEmailVerficationToken.save();
  //Send User OTP Through Email
  var transport = generateMailTransporter();
  transport.sendMail({
    from:"verification@review-app.com",
    to:newUser.email,
    suject:"Verification Email",
    html:`
      <h1>Your Verification OTP is:</h1>
      <h2>${OTP}</h2>
    `
  })
  res.status(201).json({
    user:{
      id:newUser._id,
      name:newUser.name,
      email:newUser.email
    }
  });
};

exports.verifyEmail = async (req,res)=>{
  //Here userId will be mongoose user._id sent from frontend
  const {userId,OTP} = req.body;

  //Check if the userId is valid ObjectId or not
  if(!isValidObjectId(userId)){
    return res.status(401).json({error:'Invalid User ID'});
  }

  //Find User
  const user = await User.findById({_id:userId});
  if(!user){
    return res.status(401).json({error:'No User Found'});
  }

  //If the user has already verified their email
  if(user.isVerified){
    return res.status(200).json({message:'User Is Already Verified'});
  }

  //Find the EmailVerificationToken for this user
  const token = await EmailVerificationToken.findOne({owner: userId});
  if (!token){
    return res.json({error:'token not found!'});
  }

  //Creating a custom method to check OTP string entered in frontend with hashed OTP saved in DB
  const isMatched = await token.compareTokens(OTP);
  if(!isMatched){
    return res.status(401).json({error:'Please enter correct OTP'});
  }
  user.isVerified = true;
  await user.save();

  //Delete token after user has verified their OTP
  await EmailVerificationToken.findOneAndDelete({owner:userId});

  //Send User Successful Verification Through Email
  var transport = generateMailTransporter();
  transport.sendMail({
    from:'verification@review-app.com',
    to:user.email,
    suject:'Verification Successful',
    html:`
      <h1>Verification Successful.</h1> 
      Welcome to the family ${user.name}.
    `
  })

  const jwtToken = jwt.sign({ userId:user._id}, process.env.JWT_SECRET_KEY); //payload and secret key

  res.status(201).json({
    user:{id:user._id, name: user.name, email: user.email, token: jwtToken, isVerified:user.isVerified,role:user.role},
    message: `Your email is verified ${user.name}`
  });
}

exports.resendEmailVerificationToken = async (req,res) => {
  const {userId} = req.body;

  if(!isValidObjectId(userId)){
    return res.status(401).json({error:'Invalid User ID'});
  }
  //Check if it is a valid user or not
  const user = await User.findById({_id:userId});
  if(!user){
    return res.status(401).json({error:'No User Found'});
  }
  if(user.isVerified){
    return res.status(404).json({error:"This Email Id Is Already Verified"});
  }

  const alreadyHasToken = await EmailVerificationToken.findOne({owner:userId});
  if(alreadyHasToken){
    return res.status(404).json({ error:"Only after one hour you can request for another token!"});
  }

  //Create A 6-Digit OTP For Verification
  let OTP = generateOTP();
  //Store This OTP In EmailVerficationToken Collection(Model) With Hashing Which Will Expire After 1hour
  const newEmailVerficationToken = new EmailVerificationToken({owner: user._id,token: OTP});
  await newEmailVerficationToken.save();
  //Send User OTP Through Email
  var transport = generateMailTransporter();
  transport.sendMail({
    from:'verification@review-app.com',
    to:user.email,
    suject:'Verification Email',
    html:`
      <h1>Your Verification OTP is:</h1>
      <h2>${OTP}</h2>
    `
  })
  res.status(201).json({message:'Please Verify Your Email, OTP has been sent successfully.'});
}

exports.forgetPassword = async (req,res)=>{
  const {email} = req.body;
  
  if(!email){return res.status(404).json({error:'Please Provide An Email Id.'});}

  const user = await User.findOne({email:email});
  if(!user){return res.status(404).json({error:'User not found.'});}

  const alreadyHasToken = await PasswordResetToken.findOne({owner:user._id});
  if(alreadyHasToken){return res.status(401).json({error:'Only After One Hour You Can Generate Another Token'});}

  const newToken = await generateRandomBytes();
  const newPasswordResetToken = new PasswordResetToken({owner:user._id,token:newToken});
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${newToken}&id=${user._id}`;

  const transport = generateMailTransporter();
  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Reset Password Link",
    html: `
      <p>Click here to reset password</p>
      <a href='${resetPasswordUrl}'>Change Password</a>
    `,
  });
  res.json({message:'Link Sent To Your Email'});
}

exports.sendResetPasswordTokenStatus = (req,res) => {
  res.json({ valid: true });
}

exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);
  const matched = await user.comparePassword(newPassword);
  if (matched){
    return res.status(401).json({error:"The new password must be different from the old one!"});
  }

  user.password = newPassword;
  await user.save();

  await PasswordResetToken.findByIdAndDelete(req.resetToken._id); //or findOneAndDelete({owner:userId});

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `
      <h1>Password Reset Successfully</h1>
      <p>Now you can use new password.</p>

    `,
  });

  res.json({message: "Password reset successfully, now you can use new password.",});
}

exports.signIn = async(req,res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email:email});
  if(!user){return res.status(404).json({error:'Email/ Password Mis-match-1'});}

  const matched  = await user.comparePassword(password);
  if(!matched){return res.status(404).json({error:'Email/ Password Mis-match-2'});}

  const jwtToken = jwt.sign({ userId:user._id}, process.env.JWT_SECRET_KEY); //payload and secret key

  res.status(200).json({
    user:{id:user._id, name:user.name, email:user.email, role:user.role, token:jwtToken, isVerified:user.isVerified,role:user.role}
  });
}