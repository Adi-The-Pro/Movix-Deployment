import React, {useState,useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovieForAdmin } from "../../api/movie";
import { useMovies, useNotification } from "../../Hooks";
import MovieListItem from "../MovieListItem";
import NotFoundText from "../NotFoundText";

export default function SearchMovies() {
    // this react hook is used to get the query from the url
    const [searchParams] = useSearchParams();
    const query = searchParams.get("title");

    const [movies,setMovies] = useState([]);
    const [resultNotFound, setResultNotFound] = useState(false);
    
    const {fetchMovies} = useMovies();
    const {updateNotification} = useNotification();

    const handleUIUpdate = () => fetchMovies();

    // call the backend api
    const searchMovies = async(val) => {
      const { error, results } = await searchMovieForAdmin(val);
      if (error) return updateNotification("error", error);
      if (!results.length) {
        setResultNotFound(true);
        return setMovies([]);
      }

      setResultNotFound(false);
      setMovies([...results]);
    };

    const handleAfterDelete = (movie) => {
      const updatedMovies = movies.filter((m) => {
        if(m.id!==movie.id) return m;
      })
      setMovies([...updatedMovies]);
    }
    
    const handleAfterUpdate = (movie) => {
      const updatedMovies = movies.map((m) => {
        if(m.id===movie.id) return movie;
        else return m;
      })
      setMovies([...updatedMovies]);  
    }
    

  useEffect(() => {
    if (query.trim()) searchMovies(query);
  }, [query]);

  return (
    <div className="p-5 space-y-3">
      <NotFoundText text="Record not found!" visible={resultNotFound} />
      {!resultNotFound &&
        movies.map((movie) => {
          return <MovieListItem 
            movie={movie} key={movie.id} 
            afterDelete={handleAfterDelete}
            afterUpdate={handleAfterUpdate}
          />;
        })}
    </div>
  );
}
