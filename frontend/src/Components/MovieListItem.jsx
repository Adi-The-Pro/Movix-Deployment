import React, { useState } from "react";
import { BsTrash, BsPencilSquare, BsBoxArrowUpRight } from "react-icons/bs";
import { deleteMovie } from "../api/movie";
import ConfirmModal from "../Components/modals/ConfirmModal";
import UpdateMovie from "../Components/modals/UpdateMovie";
import { useNotification } from "../Hooks";
import { getPoster } from "../utilis/helper";

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const { updateNotification } = useNotification();

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);
    if (error) return updateNotification("error", error);
    hideConfirmModal();
    updateNotification("success", message);
    afterDelete(movie);
  };

  const handleOnEditClick = () => {
    setShowUpdateModal(true);
    setSelectedMovieId(movie.id);
  };

  const handleOnUpdate = (movie) => {
    afterUpdate(movie);
    setShowUpdateModal(false);
    setSelectedMovieId(null);
  };

  //Showing Delete Confirm Modal
  const displayConfirmModal = () => setShowConfirmModal(true);

  //Showing Edit Movie Modal
  const hideConfirmModal = () => setShowConfirmModal(false);

  return (
    <>
      {/*Showing All The Movies*/}
      <MovieCard movie={movie} onDeleteClick={displayConfirmModal} onEditClick={handleOnEditClick}/>
      
      {/*Update Or Delete Modals*/}
      <div className="p-0">
        {/*Delete Movie Modal*/}
        <ConfirmModal 
          title="Are you sure?" busy={busy} 
          visible={showConfirmModal}
          onConfirm={handleOnDeleteConfirm} 
          onCancel={hideConfirmModal}
          subtitle="This action will remove this movie permanently!"
        />

        {/*Update Movie Modal*/}
        <UpdateMovie 
          visible={showUpdateModal} 
          movieId={selectedMovieId} 
          onSuccess={handleOnUpdate}
        />
      </div>
    </>
  );
};


//This Card Will Show All The Movies It has been provided with 
const MovieCard = ({ movie, onDeleteClick, onEditClick, onOpenClick }) => {
  const { poster, title, responsivePosters, genres = [], status } = movie;
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              <img className="w-full aspect-video" src={getPoster(responsivePosters) || poster} alt={title} />
            </div>
          </td>

          <td className="w-full pl-5">
            <div>
              <h1 className="text-lg font-semibold text-primary dark:text-white">
                {title}
              </h1>
              <div className="space-x-1">
                {genres.map((g, index) => {
                  return (
                    <span
                      key={g + index}
                      className=" text-primary dark:text-white text-xs"
                    >
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>

          <td className="px-5">
            <p className="text-primary dark:text-white">{status}</p>
          </td>

          <td>
            <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
              <button onClick={onDeleteClick} type="button">
                <BsTrash />
              </button>
              <button onClick={onEditClick} type="button">
                <BsPencilSquare />
              </button>
              <button onClick={onOpenClick} type="button">
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MovieListItem;
