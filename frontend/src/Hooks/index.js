import { useContext } from "react"
import { ThemeContext } from "../context/ThemeProvider"
import { NotificationContext } from "../context/NotificationProvider";
import { AuthContext } from "../context/AuthProvider";
import { SearchContext } from "../context/SearchProvider";
import { MovieContext } from "../context/MovieProvider";

//instead of writing useContext again and again we'll just write it once here and then reuse it again and again
//To access ThemeContext
export const useTheme = () => {
    return useContext(ThemeContext);
}

//To access NotificationContext
export const useNotification = () => {
    return useContext(NotificationContext);
}

//To access AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
}

//To access Live Seach Feature With Debounce/Delay
export const useSearch = () => {
    return useContext(SearchContext);
}

//To access basic movieItem functionality
export const useMovies = () => {
    return useContext(MovieContext);
}