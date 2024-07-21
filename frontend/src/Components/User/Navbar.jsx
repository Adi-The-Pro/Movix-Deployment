import React from 'react'
import {BsFillSunFill} from 'react-icons/bs'; //React-icons library
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../../Hooks';
import AppSearchForm from '../Form/AppSearchForm';

//Type rfc to load react functional component into App.js
export default function Navbar() {
  //Using ThemeContext and AuthContext
  const {toggleTheme} = useTheme();
  //Check if user is already logged in then show logout intead of login 
  const {authInfo,handleLogout} = useAuth();
  const {isLoggedIn} = authInfo;

  const navigate = useNavigate();

  const handleSeachSubmit = (query) => {
    navigate(`/movie/search?title=${query}`);
  }

  return (
    <div className="bg-primary shadow-sm shadow-gray-500">
      <div className="bg-primary max-w-screen-xl mx-auto p-2">
        <div className="flex justify-between items-center">
          <Link to='/'>
            <img src="./file.png" alt="" className="sm:h-10 h-8"/>
          </Link>
            <ul className="flex items-center sm:space-x-4 space-x-2">
              <li>
                <button onClick={toggleTheme} className=" bg-dark-subtle p-1 rounded sm:text-2xl text-lg">
                  <BsFillSunFill className='text-secondary' size={24}/>
                </button>   
              </li>
              <AppSearchForm placeholder='Search' 
                inputClassName='border-dark-subtle text-white focus:border-white sm:w-auto w-40 sm:text-lg'
                onSubmit={handleSeachSubmit}
              />
              {isLoggedIn ? 
                <button onClick={handleLogout} className="text-white font-semibold text-lg">
                  Logout
                </button>
                  : 
                <Link to='/auth/signin'>
                  <li className="text-white font-semibold text-lg">
                    Login
                  </li>
                </Link>
              }

            </ul>
        </div>
      </div>
    </div>
  )
}
