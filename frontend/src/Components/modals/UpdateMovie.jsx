import React, { useEffect, useState } from "react";
import { getMovieForUpdate, updateMovie } from "../../api/movie";
import { useNotification } from "../../Hooks";
import ModalContainer from "./ModalContainer";
import MovieForm from "../Admin/MovieForm";

export default function UpdateMovie({ movieId, visible, onSuccess}) {
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(false);
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, movie, message } = await updateMovie(movieId, data);
    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    onSuccess(movie);
  };

  const fetchMovieToUpdate = async () => {
    const { movie, error } = await getMovieForUpdate(movieId);
    if (error) return updateNotification("error", error);
    setReady(true);
    setSelectedMovie(movie);
  };

  useEffect(() => {
    if (movieId) fetchMovieToUpdate();
  }, [movieId]);

  return (
    <ModalContainer visible={visible}>
      {ready ? 
        <MovieForm 
            btnTitle="Update" busy={busy}
            initialState={selectedMovie} 
            onSubmit={!busy ? handleSubmit : null} 
        />
        :   
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-light-subtle dark:text-dark-subtle animate-pulse text-xl">
            Please wait....
          </p>
        </div>
      }
    </ModalContainer>
  );
}
