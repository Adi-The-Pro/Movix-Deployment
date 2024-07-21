import React, { useEffect, useState } from "react";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../Hooks/index";
import MovieList from "./MovieList";

export default function TopRatedTVSeries() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();
  
  //Fetch the top rated movies from the backend
  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedMovies('TV Series',signal);
    if (error) return updateNotification("error", error);
    setMovies([...movies]);
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchMovies(ac.signal);

    //Cleanup functions
    return () => {
      ac.abort();
    }
  }, []);

  return <MovieList title='Viewers Choice(TV Series)' movies={movies}/>
}
