import React, { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../Form/Title'
import Forminput from '../Form/Forminput'
import Submit from '../Form/Submit'
import Container from '../Container'
import { CustomLink } from '../Form/CustomLink'
import {commonStyleForm } from '../../utilis/theme'
import FormContainer from '../Form/FormContainer'
import { createUser } from '../../api/auth'
import { useAuth, useNotification } from '../../Hooks'


//Checking the user's input
const validateUserInfo = ({name,email,password}) => {
    //checking if name is present or not, if it is then check whether it is valid or not
    if(!name.trim()) return {ok:false, error: "Name is missing"};
    const nameRegex = /^[a-z A-Z ]+$/; //regex to match for valid names
    if(!nameRegex.test(name)) return {ok:false, error: "Invalid Name!"};

    //checking if email is present or not, if it is then check whether it is valid or not
    if(!email.trim()) return {ok:false, error:"Email is missing"};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //regex to match for valid emails
    if(!emailRegex.test(email)) return {ok:false, error:"Invalid Email!"};
    
    //checking if password is present or not, if it is then check whether it is valid or not
    if(!password.trim()) return {ok:false, error:"Password is missing"};
    if(password.length<8) return {ok:false, error:"Password must be 8 character long"};    

    return {ok:true, error:""};
}


export default function Signup() {
    const navigate = useNavigate();
    
    const {authInfo} = useAuth(); //using AuthContext
    const {isLoggedIn} = authInfo;

    //useNotification hook giving access to NotificationContext
    const {updateNotification} = useNotification();

    //storing the userInfo
    const [userInfo,setUserInfo] = useState({
        name:'',
        email:'',
        password:''
    });
    
    const {name,email,password} = userInfo;
    
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

        //go to backend and create user
        const response = await createUser(userInfo); 
        
        if(response.error) return console.log(response.error); //handle here using NotificationContext
        navigate('/auth/verification',{ //head over to verification 
            state: {user:response.user}, //send the user info in state which can accessed using useLocation
            replace: true,
        });
    };

    //If user is already logged in then move somewhere else
    useEffect(() => {
        if(isLoggedIn) navigate('/');
    },[isLoggedIn])

return (
    <FormContainer>
        <Container>
            <form onSubmit={onSubmit} action="" className={commonStyleForm + ' w-72'}>
                <Title>Sign-Up</Title>
                <Forminput value={name} onChange={onChange} name="name" label="Name" placeholder="john Doe"></Forminput>
                <Forminput value={email} onChange={onChange} name="email" label="Email" placeholder="john@email.com"></Forminput>
                <Forminput value={password} onChange={onChange} name="password" label="Password" placeholder="********" type='password'></Forminput>
                <Submit value="Sign Up"></Submit>
                <div className="flex justify-around">
                    <CustomLink to="/auth/forget-password" text="Forget Password"></CustomLink>
                    <CustomLink to="/auth/signin" text="Sign-In"></CustomLink>
                </div>
            </form>
        </Container>
    </FormContainer>
)
}
