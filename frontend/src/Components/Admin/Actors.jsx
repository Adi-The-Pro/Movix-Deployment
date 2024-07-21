import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteActor, getActors, searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../Hooks";
import NextAndPrevButton from "../NextAndPrevButton";
import UpdateActor from "../modals/UpdateActor";
import AppSearchForm from "../Form/AppSearchForm";
import NotFoundText from "../NotFoundText";
import ConfirmModal from "../modals/ConfirmModal";

let currentPageNo = 0;
const limit = 20;

export default function Actors() {
  const { updateNotification } = useNotification();
  const {handleSearch,resetSearch,resultNotFound} = useSearch();
  const [results, setResults] = useState([]);
  const [actors, setActors] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchActors = async (pageNo) => {
    const { profiles, error } = await getActors(pageNo, limit);
    if (error) return updateNotification("error", error);
    if (!profiles.length){
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setActors([...profiles]);
  };

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchActors(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchActors(currentPageNo);
  };

  const handleOnEditClick = (profile)=>{
    setShowUpdateModal(true);
    setSelectedProfile(profile);
  }

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleOnSearchSubmit = (value) => {
    handleSearch(searchActor,value,setResults);
  };

  const handleSearchFormReset = ()=>{
    resetSearch();
    setResults([]);
  };

  const handleOnActorUpdate = (profile) => {
    const updatedActors = actors.map((actor) => {
      if (profile.id === actor.id) {
        return profile;
      }
      return actor;
    });
    setActors([...updatedActors]);
  };

  //This is the code for the delete functionality.....BUT I HAVE NOT ADDED THIS FEATURE
  //CODE IS JUST FOR REFRENECE
  const handleOnDeleteClick = (profile) => {
    setSelectedProfile(profile);
    setShowConfirmModal(true);
  };
  const handleOnDeleteConfirm = async () => {
    // setBusy(true);
    // const { error, message } = await deleteActor(selectedProfile.id);
    // setBusy(false);
    // if (error) return updateNotification("error", error);
    // updateNotification("success", message);
    // hideConfirmModal();
    // fetchActors(currentPageNo);
  };
  const hideConfirmModal = () => setShowConfirmModal(false);

  //Fetching the actors based on page number
  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);

  return (
    <div className="p-5">
      <div className="flex justify-end mb-5">
        <AppSearchForm placeholder="Search Actors..." showResetIcon={results.length || resultNotFound}
        onSubmit={handleOnSearchSubmit} onReset={handleSearchFormReset}
        />
      </div>

      <NotFoundText text="Actor Not Found" visible={resultNotFound}/> 

      <div className="grid grid-cols-4 gap-5 p-5">
        {results.length || resultNotFound ? 
          results.map((actor) => (
            <ActorProfile 
              profile={actor} 
              key={actor.id} 
              onEditClick={() => handleOnEditClick(actor)}
              onDeleteClick={() => handleOnDeleteClick(actor)}
            />
          ))
        : actors.map((actor) => (
          <ActorProfile 
            profile={actor} 
            key={actor.id} 
            onEditClick={() => handleOnEditClick(actor)}
            onDeleteClick={() => handleOnDeleteClick(actor)}
          />
          ))
        }
      </div>

      {!results.length && !resultNotFound ? 
        <NextAndPrevButton 
          className="mt-5" 
          onNextClick={handleOnNextClick} 
          onPrevClick={handleOnPrevClick}
        />
        : null 
      }
      
      {/*If the user has clicked on update actor button then this compnenet is loaded*/}
      <UpdateActor visible={showUpdateModal} onClose={hideUpdateModal} 
        initialState={selectedProfile} onSuccess={handleOnActorUpdate}
      />

      {/*Delete Actor--->Pop-Up--->Just For Reference*/}
      {/*Haven't Included Delete Functionality*/}
      <ConfirmModal title="Are you sure?" subtitle="This action will remove this profile permanently!" 
        visible={showConfirmModal} busy={busy} onConfirm={handleOnDeleteConfirm} onCancel={hideConfirmModal}
      />

    </div>
  );
}

const ActorProfile = ({profile,onEditClick,onDeleteClick}) => {
  //To handle when to show delete/edit Option or not
  const [showOptions, setShowOptions] = useState(false);

  //In case the name is very long then only show 15 characters of it
  const acceptedNameLength = 15;

  //While mouse is inside this div, show options=true
  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };

  //When mouse leaves this div, show options=false
  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };

  const getName = (name) => {
    if (name.length <= acceptedNameLength) return name;

    return name.substring(0, acceptedNameLength) + "..";
  };

  if (!profile) return null;
  const { name, about = "", avatar } = profile;

  return (
    <div className="bg-white shadow dark:shadow dark:bg-secondary rounded h-20 overflow-hidden">
      <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} 
      className="flex cursor-pointer relative">
        <img src={avatar} alt={name} className="w-20 aspect-square object-cover"/>
        <div className="px-2">
          <h1 className="text-xl text-primary dark:text-white font-semibold"> {getName(name)} </h1>
          <p className="text-primary dark:text-white opacity-60"> {about.substring(0, 50)}</p>
        </div>
        <Options onEditClick={onEditClick} visible={showOptions} onDeleteClick={onDeleteClick}/>
      </div>
    </div>
  );
};

//The Opaque Cover That Come Upon Mouse-Enter
const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5">
      <button type="button" onClick={onDeleteClick}
      className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition">
        <BsTrash />
      </button>
      <button type="button" onClick={onEditClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition">
        <BsPencilSquare />
      </button>
    </div>
  );
};
