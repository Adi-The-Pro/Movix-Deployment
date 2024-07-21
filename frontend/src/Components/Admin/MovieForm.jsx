import React ,{useState,useEffect} from "react";
import TagsInput from "../TagsInput";
import { commonInputClasses } from "../../utilis/theme";
import Submit from "../Form/Submit";
import { useNotification} from "../../Hooks";
import WritersModal from "../modals/WritersModel";
import CastForm from "../Form/CastForm";
import CastModal from "../modals/CastModal";
import PosterSelector from "../PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import { languageOptions, statusOptions, typeOptions } from "../../utilis/options";
import Label from "../Label";
import DirectorSelector from "../DirectorSelector";
import WriterSelector from "../WriterSelector";
import ViewAllBtn from "../ViewAllBtn";
import LabelWithBadge from "../LabelWithBadge";
import validateMovie from "../../utilis/validator";



const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};




export default function MovieForm({onSubmit,busy,initialState,btnTitle}) {
  //Using Notification Context
  const {updateNotification} = useNotification();

  //State for storing all the movie info
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });

  //True/False For showif or hiding the show modal
  const [showWritersModal, setShowWritersModal] = useState(false);

  //True/False For showif or hiding the cast modal
  const [showCastModal, setShowCastModal] = useState(false);

  //True/False For showif or hiding the genres modal
  const [showGenresModal, setShowGenresModal] = useState(false);

  //Storing the URL of the poster selected
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");

  //After collecting all the data of the movie form
  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateMovie(movieInfo);
    if (error) return updateNotification('error',error);

    // cast, tags, genres, writers-> convert to string-->and then to formData as we have written backend like that
    const { tags, genres, cast, writers, director, poster } = movieInfo;

    //Creating formData as we are accepting it in the backend
    const formData = new FormData();

    const finalMovieInfo = {...movieInfo};

    //Converting tags to string
    finalMovieInfo.tags = JSON.stringify(tags);
    //Converting genres to string
    finalMovieInfo.genres = JSON.stringify(genres);
    //Converting cast to string
    const finalCast = cast.map((c) => (
      {actor: c.profile.id, roleAs: c.roleAs, leadActor: c.leadActor}
    ));
    finalMovieInfo.cast = JSON.stringify(finalCast);
    //Converting writer to string
    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }
    //Converting director to string
    if (director.id) finalMovieInfo.director = director.id;
    //Converting poster url to string
    if (poster) finalMovieInfo.poster = poster;

    //Now appending all the data into the formData
    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }

    onSubmit(formData);
  };


  //Capturing changes
  const handleChange = (e) => {
    //e.target has name of the field it is capturing from and its value
    const {name:fieldName,value,files} = e.target;  //fieldName could be either name , email or password
    if (fieldName === "poster") {
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }
    setMovieInfo({...movieInfo,[fieldName]:value});
  }

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedPosterForUI(url);
  };

  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };

  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };

  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };
  
  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification("warning","This profile is already selected!");
      }
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  const hideWritersModal = () => {
    setShowWritersModal(false);
  };
  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  const hideCastModal = () => {
    setShowCastModal(false);
  };
  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
  };
  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter(({ id }) => id !== profileId);
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  //In case we are using this component for updating movie data, then prefill data using initialState
  useEffect(() => {
    if(initialState){
      let {releseDate : rs} = initialState;
      rs = rs.split("T")[0]; //Changing relese date into acceptable format
      setMovieInfo({ ...initialState,releseDate:rs,poster:null});
      setSelectedPosterForUI(initialState.poster);
    }
  },[initialState])

  //Fetching all the movie uplaod information 
  const {title,storyLine,writers,cast,tags,releseDate,genres,type,language,status} = movieInfo;

  return (
  <>
    {/* The form has two parts: */}
    <div onSubmit={handleSubmit} className="flex space-x-3">

      {/*This is left part of the form*/}
      <div className="w-[70%] space-y-5">
        {/*Movie Title*/}
        <div>
          <Label htmlFor="title">Title</Label>
          <input id="title" type="text" placeholder="Titanic" name='title' value={title} onChange={handleChange}
            className={commonInputClasses + " border-b-2 font-semibold text-xl"}
          />
        </div>

        {/*Movie Title*/}
        <div>
          <Label htmlFor="storyLine">Story line</Label>
          <textarea id="storyLine" placeholder="Movie storyline..." name='storyLine' value={storyLine} 
            onChange={handleChange} className={commonInputClasses + " border-b-2 resize-none h-24"}
          ></textarea>
        </div>

        {/*Tags Input*/}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <TagsInput value={tags} name="tags" onChange={updateTags} />
        </div>

        {/*Selecting Directors*/}
        <DirectorSelector onSelect={updateDirector} />

        {/*Selecting Writers Of The Movie*/}
        <div className="">
          <div className="flex justify-between">
            <LabelWithBadge badge={writers.length} htmlFor="writers"> Writers </LabelWithBadge>
            <ViewAllBtn onClick={displayWritersModal} visible={writers.length}>
              View All
            </ViewAllBtn>
          </div>
          <WriterSelector onSelect={updateWriters} />
        </div>

        {/*Selecting Cast Of The Movie*/}
        <div>
          <div className="flex justify-between">
            <LabelWithBadge badge={cast.length}>Add Cast & Crew</LabelWithBadge>
            <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
              View All
            </ViewAllBtn>
          </div>
          <CastForm onSubmit={updateCast} />
        </div>

        {/* Selecting The Relese Date */}
        <input type="date" className={commonInputClasses + " border-2 rounded p-1 w-auto"}
          name="releseDate" value={releseDate} onChange={handleChange} 
        />


        {/*Submit The Form */}
        <Submit busy={busy} value={btnTitle} onClick={handleSubmit} type="button" />
      </div>

      {/*This is the right part of the form*/}
      <div className="w-[30%] h-5 space-y-5">
        {/* Selecting The Poster Date */}
        <PosterSelector name="poster" onChange={handleChange} 
          selectedPoster={selectedPosterForUI}  
          accept="image/jpg, image/jpeg, image/png"
          label="Select Poster"
        />

        {/* Selecting The Genres Date */}
        <GenresSelector badge={genres.length} onClick={displayGenresModal} />
        
        {/* Selecting The Movie Type */}
        <Selector
          onChange={handleChange}
          name="type"
          value={type}
          options={typeOptions}
          label="Type"
        />

        {/* Selecting The Movie Language */}
        <Selector
          onChange={handleChange}
          name="language"
          value={language}
          options={languageOptions}
          label="Language"
        />

        {/* Selecting The Movie Status */}
        <Selector
          onChange={handleChange}
          name="status"
          value={status}
          options={statusOptions}
          label="Status"
        />
      </div>
    
    </div>

    {/*Viewing Selected Writers And Deletion Functionality*/}
    <WritersModal
      onClose={hideWritersModal}
      visible={showWritersModal}
      profiles={writers}
      onRemoveClick={handleWriterRemove}
      />

    {/*Viewing Selected Cast And Deletion Functionality*/}
    <CastModal
      onClose={hideCastModal}
      casts={cast}
      visible={showCastModal}
      onRemoveClick={handleCastRemove}
      />


    {/*Viewing Selected Genres And Deletion Functionality*/}
    <GenresModal
      onSubmit={updateGenres}
      visible={showGenresModal}
      onClose={hideGenresModal}
      previousSelection={genres}
    />
  </>
  );
}
