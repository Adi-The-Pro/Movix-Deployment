import React from 'react'

export default function Container({children,className}) {
  return (
    <div className={'dark:bg-primary max-w-screen-xl mx-auto rounded-lg ' + className}> 
      {children} 
    </div>
  )
}
