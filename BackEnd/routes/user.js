const express = require('express');
const router = express.Router();
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, resetPassword, sendResetPasswordTokenStatus, signIn } = require('../controllers/user');
const { userValidator, validate, validatePassword, signInValidator } = require('../middlewares/validator');
const { isValidPasswordResetToken } = require('../middlewares/user');
const { isAuth } = require('../middlewares/auth');


router.post('/create',userValidator,validate,create);
router.post('/sign-in',signInValidator,validate,signIn);
router.post('/verify-email',verifyEmail);
router.post('/resend-email-verification-token',resendEmailVerificationToken);
router.post('/forget-password',forgetPassword);
router.post('/verify-password-reset-token', isValidPasswordResetToken,sendResetPasswordTokenStatus);
router.post('/reset-password',validatePassword,validate,isValidPasswordResetToken,resetPassword);
router.get('/is-auth', isAuth, (req,res) => {
    const {user} = req;
    return res.json({
        user:{id:user._id, name:user.name, email:user.email, isVerified:user.isVerified, role:user.role}}
    );
})

module.exports = router;
 