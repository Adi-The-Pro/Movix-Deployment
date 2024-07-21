import React from 'react'

export default function Forminput({name,placeholder,label,...rest}) {
  return (
    <div className="flex flex-col-reverse">
        <input 
            type="text" 
            id={name}
            name={name}
            className=" bg-transparent rounded border-2 dark:border-dark-subtle border-light-subtle w-full text-lg
            outline-none dark:focus:border-white p-1 focus:border-primary dark:text-white  peer transition" 
            placeholder={placeholder}  
            {...rest}
        />
        {/* whenever someone clicks on input field, label also gets highligted--> done by plaicng peer on input*/}
        <label htmlFor={name} 
        className="font-semibold dark:text-dark-subtle text-black dark:peer-focus:text-white peer-focus:text-primary 
        peer-focus:font-bold transition self-start">
          {label}
        </label>
    </div>
  )
}
