import React, { useState, useEffect } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import Submit from "./Submit";

const createArray = (count) => {
  return new Array(count).fill("");
};
const ratings = new Array(10).fill("");

export default function RatingForm({ busy, initialState, onSubmit}) {
  //stores the selected star count as array lenght 
  const [selectedRatings, setSelectedRatings] = useState([]);
  //stores the Review content 
  const [content, setContent] = useState("");

  //For changing the star icon as we hover over them
  const handleMouseEnter = (index) => {
    const ratings = new Array(index + 1).fill("");
    setSelectedRatings([...ratings]);
  };

  //Handling the content
  const handleOnChange = ({ target }) => {
    setContent(target.value);
  };

  //Handling the review submission
  const handleSubmit = () => {
    if (!selectedRatings.length) return;
    const data = {
      rating: selectedRatings.length,
      content,
    };
    onSubmit(data);
  };

  useEffect(() => {
    if (initialState) {
      setContent(initialState.content);
      setSelectedRatings(createArray(initialState.rating));
    }
  }, [initialState]);
  return (
    <div>
      <div className="p-5 dark:bg-primary bg-white rounded space-y-3">
        <div className="text-highlight dark:text-highlight-dark flex items-center relative">
          {/*Empty Stars*/}
          <StarsOutlined ratings={ratings} onMouseEnter={handleMouseEnter} />
          
          {/*Filled Stars Covering The Empty Stars As we Hove Over Them*/}
          <div className="flex items-center absolute top-1/2 -translate-y-1/2">
            <StarsFilled ratings={selectedRatings} onMouseEnter={handleMouseEnter}/>
          </div>
        </div>

        <textarea value={content} onChange={handleOnChange}
          className="w-full h-24 border-2 p-2 dark:text-white text-primary rounded outline-none bg-transparent resize-none"
        />

        <Submit busy={busy} onClick={handleSubmit} value="Rate This Movie" />
      </div>
    </div>
  );
}

//Rendering Empty Stars, number of stars would be equal to the length of ratings array
const StarsOutlined = ({ ratings, onMouseEnter }) => {
    return ratings.map((_, index) => {
        return (
            <AiOutlineStar key={index} size={24} className="cursor-pointer"
                onMouseEnter={() => onMouseEnter(index)}
            />
        );
    });
};

//Rendering Filled Stars, number of stars would be equal to the length of ratings array
//These stars would cover the original empty stars and not replace them
const StarsFilled = ({ ratings, onMouseEnter }) => {
  return ratings.map((_, index) => {
    return (
      <AiFillStar key={index} size={24} className="cursor-pointer" 
        onMouseEnter={() => onMouseEnter(index)}  
      />
    );
  });
};
