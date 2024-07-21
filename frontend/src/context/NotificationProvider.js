import React, { useState, createContext } from 'react'

//Notification Context
export const NotificationContext = createContext();

let timeoutId;
export default function NotificationProvider({children}) {
    //To store the notifications and the notification type
    const [notification,setNotification] = useState('');
    const [classes,setClasses] = useState("");

    const updateNotification = (type,value) => {
      if(timeoutId) clearTimeout(timeoutId);
      switch (type) {
        case 'error':
          setClasses("bg-red-500");
          break;
        case 'success':
          setClasses("bg-green-500");
          break;
        case 'warning':
          setClasses("bg-orange-500");
          break;  
        default:
          setClasses("bg-red-500");
      }
      setNotification(value);
      timeoutId = setTimeout(()=>{
        setNotification('');
      },3000)
    }

  return (
    <NotificationContext.Provider value={{updateNotification}}>
      {children}
      {/*If there is no notfication don't render anything*/}
      {notification && <div className='fixed  left-1/2 -translate-x-1/2 top-20 '>
        <div className='bounce-custom rounded shadow-md shadow-gray-400'>
          <p className={`${classes} text-white p-2 font-semibold`}>
            {notification}
          </p>
        </div>
      </div>}
    </NotificationContext.Provider>
  )
}
