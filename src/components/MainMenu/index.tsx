import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function MainMenu() {
    const router = useRouter()
    const currentRoute = router.pathname

    return (
        <div className='w-full bg-blue-600 px-5'>
            <nav className='max-w-2xl m-auto flex flex-wrap justify-center items-center border-b-4 border-blue100 pb-[1px]'>
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
                        className={`bg-gradient-to-t from-blue200  from-0% via-blue100 via-5% to-blue to-60% text-white text-xs font-semibold px-2 py-0.5 mr-[0.4px] mt-1 hover:text-white hover:no-underline hover:to-blue100 border-blue100 border`}
                    >   
                    {title}
                    </Link>
                ))}
            </nav>
        </div>
    )
}
