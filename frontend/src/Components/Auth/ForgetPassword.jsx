import React ,{useState} from 'react'
import Title from '../Form/Title'
import Forminput from '../Form/Forminput'
import Submit from '../Form/Submit'
import Container from '../Container'
import { CustomLink } from '../Form/CustomLink'
import {commonStyleForm } from '../../utilis/theme'
import FormContainer from '../Form/FormContainer'
import { forgetPassword } from '../../api/auth'
import { useNotification } from '../../Hooks'


//Checking the user's input
const validateUserInfo = (email) => {
  //checking if email is present or not, if it is then check whether it is valid or not
  if(!email.trim()) return {ok:false, error:"Email is missing"};
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //regex to match for valid emails
  if(!emailRegex.test(email)) return {ok:false, error:"Invalid Email!"};
  
  return {ok:true, error:""};
}

export default function ForgetPassword() {
  const [email,setEmail] = useState();

  //Using NotificationContext
  const {updateNotification} = useNotification();

  //Capturing changes
  const onChange = (e) => {
    const {value} = e.target;  //fieldName could be either name , email or password
    setEmail(value);
  }

  //submitting the data
  const onSubmit = async (e) => {
    e.preventDefault(); //to prevent the page from reloading 
    const {ok,error:validationError} = validateUserInfo(email); //check if the email is valid or not
    if(!ok) return updateNotification('error',validationError);

    const {error,message} = await forgetPassword(email);
    if(error) return updateNotification('error',error); //show error message
    updateNotification('success',message);
  }
return (
  <FormContainer>
    <Container>
      <form onSubmit={onSubmit} className={commonStyleForm + ' w-80'}>
        <Title>Please Enter Your Email</Title>
        <Forminput value={email} onChange={onChange} name="email" label="Email" placeholder="john@email.com"></Forminput>
        <Submit value="Send Link"></Submit>
        <div className="flex justify-around">
            <CustomLink to="/auth/signin" text="Sign-In"></CustomLink>
            <CustomLink to="/auth/signup" text="Sign-Up"></CustomLink>
        </div>
      </form>
    </Container>
  </FormContainer>
)
}
