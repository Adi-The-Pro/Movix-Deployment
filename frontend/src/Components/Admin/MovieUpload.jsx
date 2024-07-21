import React ,{useState}from 'react'
import { FileUploader } from 'react-drag-drop-files' //Using React-Drag-Drop Package
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { useNotification } from '../../Hooks'
import { uploadMovie, uploadTrailer } from '../../api/movie';
import MovieForm from './MovieForm';
import ModalContainer from '../modals/ModalContainer';

export default function MovieUplaod({visible,onClose}){
    //Using Notification Context 
    const {updateNotification} = useNotification();

    const [videoUploaded,setVideoUploaded] = useState(false);
    const [videoSelected,setVideoSelected] = useState(false);
    const [uploadProgress,setUploadProgress] = useState(0);
    const [videoInfo,setVideoInfo] = useState({});
    const [busy, setBusy] = useState(false);

    const resetState = () => {
        setVideoSelected(false);
        setVideoUploaded(false);
        setUploadProgress(0);
        setVideoInfo({});
      };

    //uploading the trailer to the cloud
    const handleUploadTrailer = async (formData) =>{
        //When we pass this setUploadProgress then the uploadTrailer is setting value inside it there
        const {error,url,public_id} = await uploadTrailer(formData,setUploadProgress);
        if(error) updateNotification('error',error);
        
        //if no error---> video is successfully uploaded to the cloud
        setVideoUploaded(true);
        
        //save url and public_id
        setVideoInfo({url,public_id});
    }


    //Doing Uploading Stuff
    const handleChange = (file) => {
        //As we are expecting form-data, we will create a new form-data and add the file into it
        const formData = new FormData();
        formData.append('video',file);

        //As we have selected video already, remove the TrailerSelector
        setVideoSelected(true);

        //upload the trailer
        handleUploadTrailer(formData);

    }
    
    //In Case User Drops Anything Other Than A Video
    const onTypeError = (error) => {
        updateNotification('error',error);
    }

    const getUploadProgressValue = () => {
        //If upload progress>=100 this means video is completely uploaded to backend
        //But as videoUploaded = false, this means backend is uploading video to cloudinary
        if(!videoUploaded && uploadProgress>=100){
            return `Processing`;
        }
        else{
            return `Uploaded ${uploadProgress}%`
        }
    }

    const handleSubmit = async (data) => {
        if (!videoInfo.url || !videoInfo.public_id){
            return updateNotification("error", "Trailer is missing!");
        }
        setBusy(true);
        data.append("trailer", JSON.stringify(videoInfo));
        const { error, movie } = await uploadMovie(data);
        setBusy(false);
        if (error) return updateNotification("error", error);
    
        updateNotification("success", "Movie upload successfully.");
        resetState();
        onClose();
    }

    return(
        <ModalContainer visible={visible}>
            {/* Show UploadProgress after video is selected and till the video is not uploaded to cloudinary */}
            <div className="mb-5">
                <UploadProgress visible={!videoUploaded && videoSelected} 
                    message={getUploadProgressValue()} width={uploadProgress}>
                </UploadProgress>
            </div>
            {!videoSelected ? 
                //Show TrailerSelector till the video is not selected*\
                <TrailerSelector visible={!videoSelected} handleChange={handleChange} 
                    onTypeError={onTypeError}>
                </TrailerSelector>
                :
                //Show Movie Form
                <MovieForm btnTitle="Upload" busy={busy} onSubmit={!busy ? handleSubmit : null}/>
            }   
            
        </ModalContainer>
    )
}

//Drag And Drop Featur Component
const TrailerSelector = ({visible,handleChange,onTypeError}) => {
    if(!visible) return null;
    return (
        // This is from React Drag And Drop Library
        <div className="h-full flex items-center justify-center">
            <FileUploader handleChange={handleChange} types={['mp4','avi']} onTypeError={onTypeError}>
                <label className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex flex-col items-center justify-center dark:text-dark-subtle text-secondary cursor-pointer">
                    <AiOutlineCloudUpload size={80}/>
                    <p>Drop your file here!</p>
                </label>
            </FileUploader>
        </div>
    )
}

//Upload Progress Bar On The Top
const UploadProgress = ({visible,width,message}) => {
    if(!visible) return null;
    return (
        <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
            <div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden">
                <div 
                    style={{ width: width + '%'}} //wdith:'80%'
                    className="h-full absolute left-0 dark:bg-white bg-secondary"
                />
            </div>
            <p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-1">
                {message}
            </p>
        </div>
    );

}