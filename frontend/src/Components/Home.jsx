import React from 'react'
import NotVerified from './User/NotVerified'
import TopRatedMovies from './User/TopRatedMovies'
import Container from './Container'
import TopRatedWebSeries from './User/TopRatedWebSeries'
import TopRatedTVSeries from './User/TopRatedTVSeries'
import HeroSlideShow from './User/HeroSlideShow'

export default function Home() {
  return(
    <div className="dark:bg-primary bg-test min-h-screen">
      <Container className="xl:px-0 px-2">
        <NotVerified/>

        {/* slider */}
        <HeroSlideShow/>
        <hr className='w-full border-10 dark:border-white border-secondary h-1 animate-pulse'/>

        <div className="space-y-3 py-8">
          {/* Most rated movies */}
          <TopRatedMovies />
          {/* Most rated Web Series */}
          <TopRatedWebSeries />
          {/* Most rated TV Series */}
          <TopRatedTVSeries />
        </div>
      </Container>
    </div>
  )
}
