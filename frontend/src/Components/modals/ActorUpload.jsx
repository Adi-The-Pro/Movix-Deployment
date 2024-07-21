import React,{useState} from "react";
import ModalContainer from "./ModalContainer";
import ActorForm from "../Form/ActorForm";
import { createActor } from "../../api/actor";
import { useNotification } from "../../Hooks";

export default function ActorUpload({ visible, onClose }) {
    //Accessing NotificationContext using useNotification hook
    const { updateNotification } = useNotification();
    const [busy,setBusy] = useState(false);
    const handleSubmit = async (data) => {
        setBusy(true);
        //Upload the actor info into our database
        const {error,actor} = await createActor(data);
        setBusy(false);

        //If there is any error display it using NotificationContext
        if(error) return updateNotification('error',error);
        //Otherwise display success message
        updateNotification('success','Actor Created Successfully');

        //Close the Modal Container
        onClose();
    }
    
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
        <ActorForm 
            onSubmit={!busy ? handleSubmit : null} 
            title={"Create New Actor"} 
            btnTitle={"Create"} 
            busy={busy}
        />
    </ModalContainer>
  );
}
