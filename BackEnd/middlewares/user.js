const { isValidObjectId } = require("mongoose");
const passwordResetToken = require("../models/passwordResetToken");

//Checking whether the passwordResetToken sent on the mail has expired or not as we set an expiration time of 1 hour
/*After that we are comparing the token sent on the mail with token stored in our PasswordResetToken collection
and if it matches then next() is called and middleware passes constrol to the controller on this route*/
exports.isValidPasswordResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token.trim() || !isValidObjectId(userId)) {
    return res.status(401).json({ error: "Invalid Request!Please try again." });
  }

  const validPasswordResetToken = await passwordResetToken.findOne({owner: userId});
  if (!validPasswordResetToken){
    return res.status(401).json({ error: "Unauthorized access, invalid request-1!" });
  }

  const matched = await validPasswordResetToken.compareTokens(token);
  if(!matched){return res.status(401).json({ error: "Unauthorized access, invalid request-2!" });}

  req.resetToken = validPasswordResetToken;
  next();
};
