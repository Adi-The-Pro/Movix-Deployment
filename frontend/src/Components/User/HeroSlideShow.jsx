import React, { useEffect, useRef, useState, forwardRef } from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../Hooks/index";
import { Link } from "react-router-dom";

let count = 0;
let intervalId;
export default function HeroSlideshow() {
  //using notification context
  const { updateNotification } = useNotification();
  //slides stores all the 5 latest movies 
  const [slides, setSlides] = useState([]);
  //currentSlide stores the current movie data
  const [currentSlide, setCurrentSlide] = useState({});
  //clonedSlide stores the current movie data as well....we are storing this for the animation effect
  const [clonedSlide, setClonedSlide] = useState({});
  //similarly their refs
  const slideRef = useRef(); 
  const clonedSlideRef = useRef();
  const [visible, setVisible] = useState(true);
  const [upNext, setUpNext] = useState([]);
  
  //For the up-next section on the other half of the slide show
  const updateUpNext = (currentIndex) => {
    if (!slides.length) return;
    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;

    let newSlides = [...slides];
    newSlides = newSlides.slice(upNextCount, end);
    if (!newSlides.length) {
      newSlides = [...slides].slice(0, 3);
    }
    setUpNext([...newSlides]);
  };

  const fetchLatestUploads = async (signal) => {
    const { error, movies } = await getLatestUploads(signal);
    if (error) return updateNotification("error", error);
    setSlides([...movies]);
    setCurrentSlide(movies[0]);
  };

  const handleOnNextClick = () => {
    pauseSlideShow();
    setClonedSlide(slides[count]);
    count = (count + 1) % slides.length;
    setCurrentSlide(slides[count]);
    //Adding animation class upon the next click
    clonedSlideRef.current.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");
    updateUpNext(count);
  };

  const handleOnPrevClick = () => {
    pauseSlideShow();
    setClonedSlide(slides[count]);
    count = (count + slides.length - 1) % slides.length;
    setCurrentSlide(slides[count]);
    //Adding animation class upon the prev click
    clonedSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");
    updateUpNext(count);
  };

  const handleAnimationEnd = () => {
    //Removing all the classes after either of the button clicks
    const classes = [
      "slide-out-to-left",
      "slide-in-from-right",
      "slide-out-to-right",
      "slide-in-from-left",
    ];
    slideRef.current.classList.remove(...classes);
    clonedSlideRef.current.classList.remove(...classes);
    setClonedSlide({});
    startSlideShow();
  };

  const startSlideShow = () => {
    intervalId = setInterval(handleOnNextClick, 3500);
  };

  const pauseSlideShow = () => {
    clearInterval(intervalId);
  };

  const handleOnVisibilityChange = () => {
    const visibility = document.visibilityState;
    if (visibility === "hidden") setVisible(false);
    if (visibility === "visible") setVisible(true);
  };


  //For the auto slideshow, as soon as we enter the page start the auto slideshow
  useEffect(() => {
    if (slides.length && visible){
      startSlideShow();
      updateUpNext(count);
    }
    else pauseSlideShow();
  }, [slides.length, visible]);

  //Fetching latest uploads from the backend
  useEffect(() => {
    const ac = new AbortController();
    fetchLatestUploads(ac.signal);
    //Whenever we are on the current page 
    document.addEventListener("visibilitychange", handleOnVisibilityChange);

    //When we leave the page stop the auto slideshow
    return () => {
      pauseSlideShow();
      document.removeEventListener("visibilitychange",handleOnVisibilityChange);
      ac.abort();
    };
  }, []);

  return (
    <div className="w-full flex mb-5">
      {/* Slide show section */}
      <div className="md:w-4/5 w-full aspect-video relative overflow-hidden">
        
        {/*Current Slide*/}
        <Slide ref={slideRef} title={currentSlide.title} src={currentSlide.poster} id={currentSlide.id} />

        {/*Cloned Slide For Animation Effect*/}
        <Slide ref={clonedSlideRef} title={clonedSlide.title} src={clonedSlide.poster}
          id={currentSlide.id} 
          className="absolute inset-0"
          onAnimationEnd={handleAnimationEnd}
        />

        <SlideShowController onNextClick={handleOnNextClick} onPrevClick={handleOnPrevClick}/>
      </div>

      {/* Up Next Section */}
      <div className="w-1/5 space-y-3 px-3 md:block hidden">
        <h1 className="font-semibold text-2xl text-primary dark:text-white">
          Up Next
        </h1>
        {upNext.map(({ poster, id }) => {
          return (
            <img key={id} src={poster} className="aspect-video object-cover rounded"/>
          );
        })}
      </div>
    </div>
  );
}

const SlideShowController = ({ onNextClick, onPrevClick }) => {
  const btnClass = "bg-primary rounded border-2 text-white text-xl p-2 outline-none";
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button onClick={onPrevClick} className={btnClass} type="button">
        <AiOutlineDoubleLeft />
      </button>
      <button onClick={onNextClick} className={btnClass} type="button">
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
};

//A Single Slide Design....Using forwardRef as we can't directly pass ref in props of a component 
const Slide = forwardRef((props, ref) => {
  const { title, id, src, className = "", ...rest } = props;
  return (
    <Link to={'/movie/'+id} ref={ref} className={"w-full cursor-pointer block " + className} {...rest}>
      {src ? (
        <img className="aspect-video object-cover" src={src} alt="" />
      ) : null}
      {title ? (
        <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-primary
        via-transparent dark:from-primary dark:via-transparent">
          <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
            {title}
          </h1>
        </div>
      ) : null}
    </Link>
  );
});
