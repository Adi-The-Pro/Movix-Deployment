import React, {useState,createContext, useEffect} from 'react'
import { getIsAuth, signInUser } from '../api/auth';
import { useNotification } from '../Hooks';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const defaultAuthInfo = {
    profile:null,
    isLoggedIn : false,
    isPending : false,
    error: ''
}

export default function AuthProvider({children}) {
    const navigate = useNavigate();
    const [authInfo,setAuthInfo] = useState({...defaultAuthInfo});
    
    //useNotification hook giving access to NotificationContext
    const {updateNotification} = useNotification();

    const handleLogin = async (email,password) => {
        setAuthInfo({...authInfo,isPending:true});
        const {error,user} =  await signInUser({email,password});
        if(error){
            updateNotification('error',error);
            return setAuthInfo({...authInfo,isPending:false,error:error});
        }
        navigate('/',{replace:true});
        setAuthInfo({profile:{...user},isPending:false,isLoggedIn:true,error:''});
        localStorage.setItem('auth-token',user.token);
    }

    //This checks for jwt token inside the local storage if it is present then fetch user-info from backend using that token
    const isAuth = async () => {
        const token = localStorage.getItem('auth-token');
        if(!token) return; 
        setAuthInfo({...authInfo,isPending:true});
        const {error,user} = await getIsAuth(token);
        if(error){
            // updateNotification('error',error);
            return setAuthInfo({...authInfo,isPending:false,error:error});
        }
        setAuthInfo({profile:{...user},isPending:false,isLoggedIn:true,error:''});
    }
    //This calls the isAuth upon re-render
    useEffect(() => {
        isAuth();
    },[])

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        setAuthInfo({...defaultAuthInfo});
    }

    return <AuthContext.Provider value={{authInfo,handleLogin,handleLogout,isAuth}}>
        {children}
    </AuthContext.Provider>;
}
