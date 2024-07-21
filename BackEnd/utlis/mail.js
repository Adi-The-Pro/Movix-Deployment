const nodemailer = require("nodemailer");
exports.generateOTP = (otp_lenght=6)=>{
    let OTP = "";
    for (let i=1; i<=otp_lenght; i++) {
        const randomDigit = Math.round(Math.random() * 9);
        OTP+=randomDigit;
    }
    return OTP;
}
exports.generateMailTransporter = () => {
    return nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAIL_TRAP_USER,
          pass: process.env.MAIL_TRAP_PASSWORD
        }
    });
}