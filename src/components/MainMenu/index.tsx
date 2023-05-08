import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function MainMenu() {
    const router = useRouter()
    const currentRoute = router.pathname

    return (
        <div className='w-full bg-blue-600 px-5'>
            <nav className=' max-w-2xl m-auto flex flex-wrap justify-around items-center '>
                {[
                    ['Home', '/'],
                    ['Research Topics', '/research-topics'],
                    ['Publications', '/publications'],
                    ['Talks', '/talks'],
                    ['Projects', '/projects'],
                    ['People', '/people'],
                    ['Teaching', '/teaching'],
                    ['CV', '/cv']
                ].map(([title, url]) => (
                    <Link 
                        key={title}
                        href={url}
                        className={` m-2 font-semibold hover:text-[#6DA6E2] ${currentRoute === url ? 'text-indigo-950' : 'text-sky-100'}`}
                    >   
                    {title}
                    </Link>
                ))}
            </nav>
        </div>
    )
}
