import React, { useState , useEffect} from 'react'
import Title from '../Form/Title'
import Forminput from '../Form/Forminput'
import Submit from '../Form/Submit'
import Container from '../Container'
import { CustomLink } from '../Form/CustomLink'
import {commonStyleForm } from '../../utilis/theme'
import FormContainer from '../Form/FormContainer'
import { useAuth, useNotification } from '../../Hooks'
import { useNavigate } from 'react-router-dom'


//Checking the user's input
const validateUserInfo = ({email,password}) => {
    //checking if email is present or not, if it is then check whether it is valid or not
    if(!email.trim()) return {ok:false, error:"Email is missing"};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //regex to match for valid emails
    if(!emailRegex.test(email)) return {ok:false, error:"Invalid Email!"};
    
    //checking if password is present or not, if it is then check whether it is valid or not
    if(!password.trim()) return {ok:false, error:"Password is missing"};
    if(password.length<8) return {ok:false, error:"Password must be 8 character long"};    

    return {ok:true, error:""};
}

export default function Signin() {
    const navigate = useNavigate();

    //useNotification hook giving access to NotificationContext
    const {updateNotification} = useNotification();

    //useAuth hook giving access to AuthContext
    const {handleLogin,authInfo} = useAuth();
    const {isPending,isLoggedIn} = authInfo;

    // //If user is already logged in then move somewhere else
    // useEffect(() => {
    //     if(isLoggedIn) navigate('/');
    // },[isLoggedIn])

    //storing the userInfo
    const [userInfo,setUserInfo] = useState({
        email:'',
        password:''
    });

    //Capturing changes
    const onChange = (e) => {
        //e.target has name of the field it is capturing from and its value
        const {name:fieldName,value} = e.target;  //fieldName could be either name , email or password
        setUserInfo({...userInfo,[fieldName]:value});
    }

    //submitting the data
    const onSubmit = async (e) => {
        e.preventDefault(); //to prevent the page from reloading 
        const {ok,error} = validateUserInfo(userInfo);
        if(!ok) return updateNotification('error',error); //handle here using NotificationContext
        await handleLogin(userInfo.email,userInfo.password);
    };

return (
    <FormContainer>{/*Big Dark Gray Box Below Navigation Bar*/}
        <Container> {/*Middle Light Gray Box*/}
            <form onSubmit={onSubmit} action="" className={commonStyleForm + " w-72"}>
                <Title>Sign-In</Title>
                <Forminput value={userInfo.email} onChange={onChange} name="email" label="Email" placeholder="john@email.com"></Forminput>
                <Forminput value={userInfo.password} onChange={onChange} name="password" label="Password" placeholder="********" type="password"></Forminput>
                <Submit value="Sign-In" busy={isPending}></Submit> {/*Upon clicking of this button a spin icon will*/}
                <div className="flex justify-around">
                    <CustomLink to="/auth/forget-password" text="Forget Password"></CustomLink>
                    <CustomLink to="/auth/signup" text="Sign-Up"></CustomLink>
                </div>
            </form>
        </Container>
    </FormContainer>
)
}
