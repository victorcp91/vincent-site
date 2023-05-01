import React from 'react'
import MainMenu from '../MainMenu'

interface IHeader {
    title: string
    subtitle: string
    bgImage?: string
}
export default function Header({title, subtitle, bgImage}: IHeader) {
  return (
    <>
        <header
            style={{backgroundImage: bgImage ? `url(${bgImage})` : ''}}
            className={`w-full h-40 md:h-48 bg-gradient-to-r from-sky-500 to-indigo-500 flex flex-col justify-center items-center`}>
        <h1 className='text-amber-50 text-3xl md:text-5xl'>{title}</h1>
        <h2 className='text-amber-50 text-lg md:text-2xl mt-2'>{subtitle}</h2>
        </header>
        <MainMenu />
    </>
  )
}
