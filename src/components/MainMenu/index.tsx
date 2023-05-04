import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function MainMenu() {
    const router = useRouter()
    const currentRoute = router.pathname

    return (
        <nav className='w-full flex flex-wrap justify-around items-center bg-blue-600'>
            {[
                ['Home', '/'],
                ['Research', '/research'],
                ['Publications', '/publications'],
                ['Talks', '/talks'],
                ['People', '/people'],
                ['Teaching', '/teaching'],
                ['CV', '/cv']
            ].map(([title, url]) => (
                <Link 
                    key={title}
                    href={url}
                    className={` m-2 font-semibold hover:text-indigo-800 ${currentRoute === url ? 'text-indigo-950' : 'text-sky-100'}`}
                >   
                {title}
                </Link>
            ))}
        </nav>
    )
}
