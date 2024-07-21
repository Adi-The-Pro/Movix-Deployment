import React from "react";
import { useParams } from "react-router-dom";
import { addReview } from "../../api/review";
import { useNotification } from "../../Hooks/index";
import RatingForm from "../Form/RatingForm";
import ModalContainer from "./ModalContainer";

export default function AddRatingModal({ visible, onSuccess, onClose }) {
  const { movieId } = useParams();
  const { updateNotification } = useNotification();

  //Submittng the users review and storing it in the backend
  const handleSubmit = async (data) => {
    const { error, message, reviews } = await addReview(movieId, data);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    onSuccess(reviews);
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm onSubmit={handleSubmit} />
    </ModalContainer>
  );
}
