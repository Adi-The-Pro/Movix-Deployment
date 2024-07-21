import React, { useEffect, useState } from "react";
import { useMovies} from "../../Hooks/index";
import MovieListItem from "../MovieListItem";
import NextAndPrevButton from "../NextAndPrevButton";

export default function Movies() {
  //Using Movies Hook which has common functionality
  const {fetchMovies, fetchNextPage, fetchPrevPage, movies:newMovie} = useMovies();
const handleUIUpdate = () => fetchMovies();

  
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <>
      <div className="space-y-3 p-5">
        {/*Showing All The Movies*/}
        {newMovie.map((movie) => {
          return( 
            <MovieListItem 
              key={movie.id} 
              movie={movie} 
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
            />
          );
        })}

        {/*Next Page And Previous Page Button*/}
        <NextAndPrevButton className="mt-5" onNextClick={fetchNextPage} onPrevClick={fetchPrevPage}/>
      </div>
    </>
  );
}
