import React from 'react'

export default function AppInfoBox({title,subtitle}) {
  return (
    <div className="dark:bg-secondary light:bg-white  shadow p-5 rounded">
        <h1 className='font-semibold text-2xl mb-2 light:text-primary dark:text-white'>
          {title}
        </h1>
        <p className='text-xl light:text-primary dark:text-white'>{subtitle}</p>
    </div>
  )
}
