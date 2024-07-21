import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Container from '../Container'
import Title from '../Form/Title'
import Submit from '../Form/Submit'
import {commonStyleForm } from '../../utilis/theme';
import FormContainer from '../Form/FormContainer';
import { resendEmailVerificationToken, verifyUserEmail } from '../../api/auth'
import { useAuth, useNotification } from '../../Hooks'


const OTP_LENGTH = 6;
let currentOtpIndex;

const isValidOTP = (otp) => {
  let valid = true;
  for(let val of otp){
    valid = valid && !isNaN(parseInt(val));   // checking for this ['1','','','','','']
  }
  return valid;
}

export default function EmailVerification() {
  const navigate = useNavigate();
  const {state} = useLocation(); //data passed in useNavigate can be accessed here
  const user = state?.user;

  //Using NotificationContext and AuthContext
  const {updateNotification} = useNotification();
  const {isAuth,authInfo} = useAuth();
  const {isLoggedIn,profile} = authInfo;
  const isVerified = profile?.isVerified;

  //Taking OTP input
  const [otp,setotp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const inputRef = useRef(null);

  function focusPrevIndex(index){
    if(index===0){
      setActiveOtpIndex(0);
    }
    else{
      setActiveOtpIndex(index-1);
    }
  }
  function focusNextIndex(index){
    setActiveOtpIndex(index+1);
  }
  
  function handleChange(e){
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[currentOtpIndex]=value.substring(value.length-1,value.length); 
    if(!value) {
      focusPrevIndex(currentOtpIndex);
    }
    else{
      focusNextIndex(currentOtpIndex);
    }
    setotp([...newOtp]);   
  }

  function handleKeyDown({key},index){
    currentOtpIndex = index;
    if(key==="Backspace"){
      focusPrevIndex(currentOtpIndex);
    }
  }

  useEffect(()=>{
    inputRef.current?.focus();
  },[activeOtpIndex])


  //On submit button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    //check if otp is valid or not
    if(!isValidOTP(otp)){
      return updateNotification('error',"Invalid Otp");
    }
    //submit otp
    const optStr = otp.join("");
    const {error, message, user:userResponse} = await verifyUserEmail({userId:user.id,OTP:optStr});
    if(error) return updateNotification('error',error); //show error message
    updateNotification('success',message);
    
    //Setting the jwt token inside the local storage
    localStorage.setItem('auth-token',userResponse.token);
    //Now updating 'authInfo' using 'isAuth' method of the AuthContext using the token
    isAuth();
  }

  //handling resend email verification token 
  const handleOTPResend = async () => {
    const {error, message} = await resendEmailVerificationToken(user.id);
    if(error) return updateNotification('error',error); //show error message
    updateNotification('success',message);
  }

  //check if there is no userInfo then this can't accessed in that case navigate to the not-found page
  useEffect(() => {
    if(!user) navigate('/not-found');
    if(isLoggedIn && isVerified) navigate('/'); 
  },[user,isLoggedIn,isVerified]);

return (
  <FormContainer>
    <Container>
      <form onSubmit={handleSubmit} className={commonStyleForm + ' w-auto'}>
        <div className="">
          <Title>Please Enter OTP To Verify Your Account</Title>
            <p className="dark:text-white  text-black text-center font-semibold"> 
              OTP has been sent to your email
            </p>
        </div>
        
        <div className="flex justify-evenly">
          {otp.map((unused,index)=>{
            {/*check index.css on how to remove spin-button using custom CSS*/}
            return (
              <input type="number" 
                key={index}
                ref={activeOtpIndex === index ? inputRef : null}
                value={otp[index] || ""}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e,index)}
                className="w-12 h-12 text-center border-2 rounded font-bold bg-transparent spin-button-none transition 
                 dark:text-white text-black dark:border-white border-black dark:hover:border-red-300 hover:border-red-800
                ">
              </input>
            )
          })}
        </div>
        <div>
          <Submit value="Verify Account"></Submit>   
          {/* type=button is given so that form doesn't get submitted upon clicking of this button */}
          <button onClick={handleOTPResend} type="button" className="dark:text-white text-blue-500 font-semibold hover:underline mt-2">I don't have OTP</button>
        </div>
      </form>
    </Container>
  </FormContainer>
)
}
