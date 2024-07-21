import React, { createContext, useState } from "react";
import { useNotification } from "../Hooks";

//Creating a new context
export const SearchContext = createContext();

let timeoutId;
//debounce accepts a search() function which we want to delay executing
//return search() fucntion in which will pass the arguments
const debounce = (func, delay) => {
    return (...args) => {
        //If there is already a timeout which is not yet executed clear it 
        if (timeoutId) clearTimeout(timeoutId);
        //Create a newTimeout which will be called after delay
        timeoutId = setTimeout(() => {
            //Pass the arguments which will be basically the query
            func.apply(null, args);
        }, delay);
  };
};

export default function SearchProvider({ children }) {
    //Using NotificationContext using custom hook
    const { updateNotification } = useNotification();

    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState([]);
    const [resultNotFound, setResultNotFound] = useState(false);

    const search = async (method, query, updaterFun) => {
        const { error, results } = await method(query);
        if (error) return updateNotification("error", error);
        if (!results.length){
            setResults([]);
            updaterFun && updaterFun([]);
            return setResultNotFound(true);
        }
        setResultNotFound(false);
        setResults(results);
        updaterFun && updaterFun([...results]);
    };
    
    //debounce returns a function which will be called after a delay of 300 --> search() function basically
    //Later we can pass the query inside this function(debounceFunc)
    const debounceFunc = debounce(search, 300);
    

    //This is the starting point function:
    //method is the function that needs to be called and query-->search query or parameter for this function
    const handleSearch = (method, query, updaterFun) => {
        //Set searching to true
        setSearching(true);
        //If the query is empty dont do anything
        if (!query.trim()) {
            updaterFun && updaterFun([]);
            return resetSearch();
        }
        //debounceFunc takes method and query and pass it to search()
        debounceFunc(method, query, updaterFun);
    };

    const resetSearch = () => {
        setSearching(false);
        setResults([]);
        setResultNotFound(false);
        console.log('Hi');
    };

    return (
        <SearchContext.Provider value={{ handleSearch, resetSearch, searching, resultNotFound, results }}>
        {children}
        </SearchContext.Provider>
    );
}
