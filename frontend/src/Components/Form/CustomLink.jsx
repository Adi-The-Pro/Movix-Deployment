import React from 'react'
import { Link } from 'react-router-dom'

export const CustomLink = ({to,text}) => {
  return (
    <Link to={to}
      className="dark:text-white text-black hover:text-red-300 transition my-2"  > 
      {text}
    </Link>
  )
}
