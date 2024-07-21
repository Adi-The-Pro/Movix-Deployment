import React,{useState} from 'react'
import { Route, Routes } from 'react-router-dom'
import NotFound from '../Components/NotFound'
import Dashboard from '../Components/Admin/Dashboard'
import Movies from '../Components/Admin/Movies'
import Actors from '../Components/Admin/Actors'
import Navbar from '../Components/Admin/Navbar'
import Header from '../Components/Admin/Header'
import MovieUpload from '../Components/Admin/MovieUpload'
import ActorUpload from '../Components/modals/ActorUpload'
import SearchMovies from '../Components/Admin/SearchMovies'

export default function AdminNavigator() {
  const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);
  const [showActorUploadModal, setShowActorUploadModal] = useState(false);
  const displayMovieUploadModal = () => {
    setShowMovieUploadModal(true);
  };
  const hideMovieUploadModal = () => {
    setShowMovieUploadModal(false);
  };

  const displayActorUploadModal = () => {
    setShowActorUploadModal(true);
  };
  const hideActorUploadModal = () => {
    setShowActorUploadModal(false);
  };
  return (
    <>      
      <div className="flex dark:bg-primary bg-white">
        <Navbar/>
        <div className="flex-1 p-2 max-w-screen-xl">
        <Header onAddMovieClick={displayMovieUploadModal} onAddActorClick={displayActorUploadModal}/>
          <Routes>
            <Route path="/" element={<Dashboard></Dashboard>}></Route>
            <Route path="/movies" element={<Movies></Movies>}></Route>
            <Route path="/actors" element={<Actors></Actors>}></Route>
            <Route path="/search" element={<SearchMovies></SearchMovies>}></Route>
            <Route path="*" element={<NotFound></NotFound>}></Route>
          </Routes>
        </div>
      </div>
      <MovieUpload visible={showMovieUploadModal} onClose={hideMovieUploadModal}/>
      <ActorUpload visible={showActorUploadModal} onClose={hideActorUploadModal}/>
    </>
  )
}
