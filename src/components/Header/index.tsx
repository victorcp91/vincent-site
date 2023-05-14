import React from 'react'
import MainMenu from '../MainMenu'

interface IHeader {
    title: string
    subtitle: string
}
export default function Header({title, subtitle}: IHeader) {
  return (
    <div className='mx-5'>
        <header className="m-auto w-full pt-6 pb-4 flex flex-col justify-center max-w-2xl">
          <h1 className='text-blue text-3xl'>{title}</h1>
          <h4 className='mx-10 text-gray'>{subtitle}</h4>
        </header>                                                                                                                                                                               
        <MainMenu />
    </div>
  )
}
