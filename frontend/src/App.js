import React from 'react'
import Navbar from './Components/User/Navbar'
import Home from './Components/Home'
import Signin from './Components/Auth/Signin'
import Signup from './Components/Auth/Signup'
import EmailVerification from './Components/Auth/EmailVerification'
import ForgetPassword from './Components/Auth/ForgetPassword'
import {Routes,Route} from "react-router-dom";
import ConfirmPassword from './Components/Auth/ConfirmPassword'
import NotFound from './Components/NotFound'
import { useAuth } from './Hooks'
import AdminNavigator from './navigator/AdminNavigator'
import SingleMovie from './Components/User/SingleMovie'
import MovieReviews from './Components/User/MovieReviews'
import SearchMovies from './Components/User/SearchMovies'

//Type rfc to load react functional component into App.js
export default function App() {
  const {authInfo} = useAuth();
  const isAdmin = authInfo.profile?.role === 'admin';

  if(isAdmin) return <AdminNavigator></AdminNavigator>
  
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/auth/signin" element={<Signin/>}></Route>
        <Route path="/auth/signup" element={<Signup/>}></Route>
        <Route path="/auth/verification" element={<EmailVerification/>}></Route>
        <Route path="/auth/forget-password" element={<ForgetPassword/>}></Route>
        <Route path="/auth/reset-password" element={<ConfirmPassword/>}></Route>
        <Route path="/movie/:movieId" element={<SingleMovie/>}></Route>
        <Route path="/movie/reviews/:movieId" element={<MovieReviews/>}></Route>
        <Route path="/movie/search" element={<SearchMovies/>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </>
  )
}
