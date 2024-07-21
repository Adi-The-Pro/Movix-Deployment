import React,{createContext,useEffect} from 'react'

export const ThemeContext = createContext();

export default function ThemeProvider({children}) {

  //Theme Change Logic Starts Here
  /*We'll store the theme(dark or light) that is currently applied in the local storage 
  so that even after reload the theme remains applied, below is the function to fetch the currently applied theme*/
  const getTheme = () => {
    return localStorage.getItem('theme');
  }

  //The theme that is added to the classList will be shown
  //So first remove the oldTheme and then add the newTheme from the classList
  const updateTheme = (theme,themeToRemove) => {
    //If there is a theme to remove then remove it otherwise add it 
    if(themeToRemove) document.documentElement.classList.remove(themeToRemove);
    document.documentElement.classList.add(theme);
  }

  //This will render the theme on the first reload 
  useEffect(() => {
    const theme = getTheme();
    if(!theme || theme==='light') updateTheme('light');
    else updateTheme('dark');
  },[])

  //Toggle logic after clicking
  const toggleTheme = () => {
    const oldTheme = getTheme(); //fetch the currently applied theme stored in local storage
    const newTheme = oldTheme==='light' ? 'dark' : 'light'; //if it is light change to dark or vice versa
    updateTheme(newTheme,oldTheme); //update the theme upon clicking
    localStorage.setItem('theme',newTheme);
  }
  //Theme Change Logic ends Here

  //This is the provider that we wrap around the app in index.js so that every component inside could access Theme Context
  return (
    //value contains the thing that the ThemeContext returns when called
    <ThemeContext.Provider value={{toggleTheme}}>
        {children}
    </ThemeContext.Provider>
  )
}
