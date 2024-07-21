import React, { useEffect, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsFillSunFill } from 'react-icons/bs';
import { useTheme } from '../../Hooks';
import AppSearchForm from '../Form/AppSearchForm';
import { useNavigate } from 'react-router-dom';

export default function Header({onAddMovieClick,onAddActorClick}) {
  //Using ThemeContext
  const {toggleTheme} = useTheme();
  
  //Using navigate hook
  const navigate = useNavigate();

  //Storing Whether To Show The Dropdown Or Not
  const [showOptions,setShowOptions] = useState(false);
  
  const options = [
    {title:"Add Movie",onClick:onAddMovieClick},
    {title:"Add Actor",onClick:onAddActorClick},
  ];

  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;

    navigate("/search?title=" + query);
  }

  return (
    <div className='flex items-start justify-between relative'>
        {/*Search Movies Input Box*/}
        <AppSearchForm onSubmit={handleSearchSubmit} placeholder="Search Movies..."/>

        <div className="flex items-center space-x-3">
          {/*Create Dropdown Having Two Options Add Movie/Actor*/}
          <button onClick={toggleTheme} className="dark:text-white text-light-subtle bg-dark-subtle p-1 rounded">
            <BsFillSunFill className='text-secondary' size={24}/>
          </button> 
          
          <button onClick={() => setShowOptions(true)}
          className='flex items-center space-x-2 border-2 rounded text-lg px-3 py-1 font-semibold 
          dark:border-dark-subtle border-light-subtle hover:border-primary text-secondary
          dark:text-dark-subtle hover:opacity-80 transition'
          >
            <span>Create</span>
            <AiOutlinePlus/>
          </button>
        </div>

        {/*Options For The Create Dropdown*/}
        <CreateOptions options={options} visible={showOptions} onClose={() => setShowOptions(false)}/>
    </div>
  )
}


const CreateOptions = ({options,visible,onClose}) => {
  const container = useRef();
  const containerId = 'option-container';
  useEffect(() => {
    const handleClose = (e) => {
      if(!visible) return;
      const {parentElement,id} = e.target;
      if(parentElement?.id===containerId || id===containerId) return; 
      if (container.current) {
        if (!container.current.classList.contains("animate-scale"))
          container.current.classList.add("animate-scale-reverse");
      }
    };
    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);

  const handleAnimationEnd = (e) => {
    if(e.target.classList.contains("animate-scale-reverse")) onClose();
    e.target.classList.remove("animate-scale");
  }

  const handleClick = (fn) => {
    fn();
    onClose();
  };

  //Options For The Create Dropdown
  if(!visible) return null;
  return(
    <div id={containerId} ref={container} className="absolute right-0 top-12 flex flex-col space-y-3 p-5 
    animate-scale dark:bg-secondary bg-white drop-shadow-lg z-50"
    onAnimationEnd={handleAnimationEnd}
    >
      {options.map((option) => {
        const {title,onClick} = option;
        return <Option key={title} onClick={() => handleClick(onClick)}>{title}</Option>
      })}
    </div>
  )
}

const Option = ({children,onClick}) => {
  return(
    <button onClick={onClick} className='dark:text-white text-secondary hover:opacity-80 transition'>
      {children}
    </button>
  )
}