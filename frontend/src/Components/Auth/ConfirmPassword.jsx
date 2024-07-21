import React , {useEffect, useState}from 'react'
import Container from '../Container'
import Title from '../Form/Title'
import Forminput from '../Form/Forminput'
import Submit from '../Form/Submit'
import {commonStyleForm } from '../../utilis/theme'
import FormContainer from '../Form/FormContainer'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ImSpinner3 } from "react-icons/im";
import { resetPassword, verifyPasswordResetToken } from '../../api/auth'
import { useNotification } from '../../Hooks'

export default function ConfirmPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState({one:'',two:''});

    //checking if the token is in verifying phase or not
    const [isVerifying, setIsVerifying] = useState(true);

    //check if the token is valid or not
    const [isValid,setIsValid] = useState(false);

    //getting the token and the userId from the url link -- params using useSearchParams hook
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const userId = searchParams.get('id');

    //Using NotificationContext
    const {updateNotification} = useNotification();

    useEffect(()=>{
        isValidToken();
    },[]);

    const isValidToken = async () =>{
        const {error,valid} = await verifyPasswordResetToken(token,userId);
        setIsVerifying(false);
        if(error){
            navigate('/auth/reset-password',{replace:true});
            return updateNotification('error',error);
        }
        if(!valid){
            setIsValid(false);
            return navigate('/auth/reset-password',{replace:true});
        }
        setIsValid(true);
    }

    if(isVerifying) {
        return(
            <FormContainer>
                <Container>
                    <div className="flex space-x-2 items-center">
                        <h1 className='text-3xl font-semibold dark:text-white text-primary'>
                            Please Wait We Are Verifying Your Token
                        </h1>
                        <ImSpinner3 className='animate-spin text-3xl dark:text-white text-primary'/>
                    </div>
                </Container>
            </FormContainer> 
        )
    }

    if(!isValid){
        return(
            <FormContainer>
                <Container>
                    <div className="flex space-x-2 items-center">
                        <h1 className='text-3xl font-semibold dark:text-white text-primary'>
                            Sorry The Token Is Invalid!
                        </h1>
                    </div>
                </Container>
            </FormContainer> 
        )
    }

    const handleChange = (e) => {
        const {name,value} = e.target;
        setPassword({...password,[name]:value});
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        //If no password is typed
        if(!password.one.trim()) {
            return updateNotification('error',"Password is missing");
        }
        //Is Password is less than 8 characters
        if(password.one.trim().length < 8) {
            return updateNotification('error',"Password must be at least 8 characters");
        }
        //If New Password and Confirm Password are not same
        if(password.one !== password.two){
            return updateNotification('error',"Password do not match");
        }
        const {error,message} = await resetPassword({token,userId,newPassword:password.one});
        if(error)return updateNotification('error',error);
        updateNotification('success',message);
        navigate('/auth/signin',{replace:true});
    } 

return (
    <FormContainer>
        <Container>
        <form onSubmit={onSubmit} className={commonStyleForm + ' w-80'}>
            <Title>Enter New Password</Title>
            <Forminput value={password.one} onChange={handleChange} name="one" label="New Password" placeholder="********" type='password'></Forminput>
            <Forminput value={password.two} onChange={handleChange} name="two" label="Confirm Password" placeholder="********" type='password'></Forminput>
            <Submit value="Confirm Password"></Submit>
        </form>
        </Container>
    </FormContainer>
)

}
