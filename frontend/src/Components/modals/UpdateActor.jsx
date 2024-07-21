import React, { useState } from "react";
import { useNotification } from "../../Hooks/index";
import ModalContainer from "./ModalContainer";
import ActorForm from "../Form/ActorForm.jsx";
import { updateActor } from "../../api/actor.js";

export default function UpdateActor({visible,initialState,onSuccess,onClose}){
  const [busy, setBusy] = useState(false);
  const { updateNotification } = useNotification();

  const handleSubmit= async(data)=>{
    setBusy(true);
    const {error,actor} = await updateActor(initialState.id, data);
    setBusy(false);
    if (error) return updateNotification("error", error);
    onSuccess(actor);
    updateNotification("success", "Actor updated successfully.");
    onClose();
  };

  if(!visible) return null;
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm title="Update Actor" btnTitle="Update" busy={busy}
        onSubmit={!busy ? handleSubmit : null}
        initialState={initialState}
      />
    </ModalContainer>
  );
}
