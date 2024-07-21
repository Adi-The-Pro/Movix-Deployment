import React, { useState } from "react";
import {AiOutlineClose} from 'react-icons/ai';

const defaultInputStyle = 
'dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-white'

export default function AppSearchForm({showResetIcon,placeholder, onSubmit, onReset, inputClassName=defaultInputStyle}) {
  const [value, setValue] = useState("");
  const handleOnSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };
  const handleReset = ()=>{
    setValue("");
    onReset();
  }

  return (
    <form className="relative" onSubmit={handleOnSubmit}>
        <input type="text" value={value} placeholder={placeholder}
        className={"border-2 transition bg-transparent rounded text-lg p-1 outline-none " + inputClassName}
        onChange={({ target }) => setValue(target.value)}
        />
        {!showResetIcon ? null : 
            <button type="button" onClick={handleReset}
            className="absolute top-1/2 -translate-y-1/2 right-2 dark:text-white light:text-secondary">
                <AiOutlineClose/>
            </button>
        }
    </form>
  );
}
