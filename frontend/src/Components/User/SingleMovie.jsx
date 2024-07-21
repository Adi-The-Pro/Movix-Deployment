import React, { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import { getSingleMovie } from "../../api/movie";
import { useAuth, useNotification } from "../../Hooks/index";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";
import AddRatingModal from "../modals/AddRatingModal";
import CustomButtonLink from "../CustomButtonLink";
import ProfileModal from "../modals/ProfileModal";


const convertReviewCount = (count=0) =>{
  if(count<=999) return count;
  return parseFloat(count/1000).toFixed(2) + "k";
}

const convertDate = (date = "") => {
  return date.split("T")[0];
};

export default function SingleMovie() {
  const [ready, setReady] = useState(false);
  const [movie, setMovie] = useState({});
  const [showRatingModal, setShowRatingModal] = useState();
  const [showProfileModal, setShowProfileModal] = useState();
  const [selectedProfile, setSelectedProfile] = useState({});
  const navigate = useNavigate();

  //Fetching the movieId from the URL(params)
  const { movieId } = useParams();
  const { updateNotification } = useNotification();

  //Using Auth Context To Know Whether The User Is Logged In Or Not
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;


  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);
    console.log(movie);
    if (error) return updateNotification("error", error);
    setReady(true);
    setMovie(movie);
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) return navigate("/auth/signin");
    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    setMovie({...movie, reviews: {...reviews}});
  }

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  }

  const hideProfileModal = () => {
    setShowProfileModal(false);
  }

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  //If the movie-data is not ye fetched show please wait 
  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">
          Please wait
        </p>
      </div>
  );

  //Destructuring the movie data 
  const { id, trailer, poster, title, type, storyLine, language, releseDate, director={}, reviews={}, 
    writers=[], cast=[], genres = [],} = movie;

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <div className="dark:bg-primary max-w-screen-lg mx-auto rounded-lg xl:px-0 px-2">
        {/*Trailer Part*/}
        <video poster={poster} controls src={trailer} className="aspect-video"/>

        {/*Movie Title + Rating + Reviews*/}
        <div className="flex justify-between">
          <h1 className="xl:text-4xl lg:text-3xl text-2xl  text-highlight dark:text-highlight-dark font-semibold py-3">
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg}/>
            <CustomButtonLink
              label={convertReviewCount(reviews.reviewCount) + " Reviews"}
              onClick={() => navigate("/movie/reviews/" + id)}
            />
            <CustomButtonLink
              label="Rate the movie"
              onClick={handleOnRateMovie}
            />
          </div>
        </div>

        {/*Movie Info*/}
        <div className="space-y-3">
          {/*Story Line Of The Movie*/}
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>

          {/*Director's Name*/}
          <ListWithLabel label="Director:">
            <CustomButtonLink label={director.name} onClick={()=>handleProfileClick(director)}/>
          </ListWithLabel>

          {/*Writers Name*/}
          <ListWithLabel label="Writers:">
            {writers.map((w) => (
              <CustomButtonLink key={w.id} label={w.name} onClick={()=>handleProfileClick(w)}/>
            ))}
          </ListWithLabel>

          {/*Cast Name*/}
          <ListWithLabel label="Cast:">
            {cast.map(({ id, profile, leadActor }) => {
              return leadActor ? (
                <CustomButtonLink key={id} label={profile.name} onClick={()=>handleProfileClick(profile)}/>
              ) : null;
            })}
          </ListWithLabel>

          {/*Language*/}
          <ListWithLabel label="Language:">
            <CustomButtonLink label={language} clickable={false} />
          </ListWithLabel>

          <ListWithLabel label="Release Date:">
            <CustomButtonLink
              label={convertDate(releseDate)}
              clickable={false}
            />
          </ListWithLabel>
          
          {/*Genres*/}
          <ListWithLabel label="Genres:">
            {genres.map((g) => (
              <CustomButtonLink label={g} key={g} clickable={false} />
            ))}
          </ListWithLabel>

          {/*Movie Type*/}
          <ListWithLabel label="Type:">
            <CustomButtonLink label={type} clickable={false} />
          </ListWithLabel>
          
          {/*Cast*/}
          <CastProfiles cast={cast} onProfileClick={handleProfileClick}/>

          <RelatedMovies movieId={movieId}/>
        </div>
      </div>
      
      {/*For Any Actors Full Information*/}
      <ProfileModal visible={showProfileModal} onClose={hideProfileModal} profileId={selectedProfile.id}/>

      {/*For Adding New Reviews*/}
      <AddRatingModal visible={showRatingModal} onClose={hideRatingModal} onSuccess={handleOnRatingSuccess}/>
    </div>
  );
}


const ListWithLabel = ({ children, label }) => {
  return (
    <div className="flex space-x-2">
      <p className="text-light-subtle dark:text-dark-subtle font-semibold">
        {label}
      </p>
      {children}
    </div>
  );
};

const CastProfiles = ({ cast, onProfileClick }) => {
  return (
    <div className="">
      <h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
        Cast:
      </h1>
      <div className="flex flex-wrap space-x-4">
        {cast.map(({ id, profile, roleAs }) => {
          return (
            <div key={id} className="basis-28 flex flex-col items-center text-center mb-4">
              <img src={profile.avatar}
                className="w-24 h-24 aspect-square object-cover rounded-full"
              />

              <CustomButtonLink label={profile.name} onClick={()=>onProfileClick(profile)}/>
              <span className="text-light-subtle dark:text-dark-subtle text-sm">
                as
              </span>
              <p className="text-light-subtle dark:text-dark-subtle">
                {roleAs}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};





