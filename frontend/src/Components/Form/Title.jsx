import React from 'react'

export default function Title({ children }) {
    return (
        <h1 className="text-xl dark:text-white text-black text-center font-bold">{children}</h1>
    )
}