import React from "react";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import GridContainer from "../GridContainer";
import RatingStar from "../RatingStar";
import { getPoster } from "../../utilis/helper";

const trimTitle = (text = "") => {
  if (text.length <= 20) return text;
  return text.substring(0, 18) + "..";
};

//This is will all the movies in the 'movies' that it get as prop
export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null;
  return (
    <div>
      <h1 className="text-2xl dark:text-white text-secondary font-bold mb-3">
        {title}
      </h1>
      <GridContainer>
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />;
        })}
      </GridContainer>
    </div>
  );
}

//This is the design for a single movie
const ListItem = ({ movie }) => {
  const { id, title, poster, responsivePosters, reviews } = movie;
  return (
    <Link to={"/movie/" + id}>
      <img src={getPoster(responsivePosters) || poster} alt={title}
        className="aspect-video object-cover w-full border-2 rounded-sm dark:border-secondary border-primary" 
      />
      {title ? <h1 title={title} className="text-lg dark:text-white text-secondary font-semibold">
        {trimTitle(title)}
      </h1> : null}
      {/*Movie Rating*/}
      <RatingStar rating={reviews.ratingAvg}/>
    </Link>
  );
};
