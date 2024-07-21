import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks';
import FormContainer from '../Form/FormContainer';

export default function NotVerified() {
    const navigate = useNavigate();
    const {authInfo} = useAuth();
    const {isLoggedIn} = authInfo;
    const isVerified = authInfo.profile?.isVerified;
  
    const navigateToVerification = () => {
      navigate('/auth/verification',{ //head over to email-verification 
        state: {user:authInfo.profile}, //send the user info in state which can accessed using useLocation hook
    });
    };
    return (
        <div>
          {isLoggedIn && !isVerified ? (
            <p className='text-lg text-center bg-blue-50 p-2'>
              It looks like you haven't verified your account!!
              <button onClick={navigateToVerification} className='text-blue-500 font-semibold hover:underline ml-1'>
                Click here to verify your account
              </button>
            </p>
          ) : null}
        </div>
    )
}
