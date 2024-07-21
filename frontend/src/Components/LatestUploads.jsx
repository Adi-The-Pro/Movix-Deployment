import React,{useState,useEffect} from 'react'
import MovieListItem from './MovieListItem'
import {useMovies} from '../Hooks';

export default function LatestUploads() {
    const {latestUploads,fetchLatestUploads} = useMovies();

    const handleUIUpdate = () => fetchLatestUploads();

    useEffect(() => {
      fetchLatestUploads();
    }, []);

    return (
        <>
        <div className="dark:bg-secondary light:bg-white  shadow p-5 rounded col-span-2">
            <h1 className='light:text-secondary dark:text-white text-xl font-semibold'>Recent Uploads</h1>
            {latestUploads.map((movie) => {
                return (
                    <MovieListItem 
                        key={movie.id} 
                        movie={movie} 
                        afterDelete={handleUIUpdate}
                        afterUpdate={handleUIUpdate}
                    />
                );
            })}
        </div>
        </>
    )
}
