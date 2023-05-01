import Head from 'next/head'
import Image from 'next/image'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IMain, IHomeData } from '@/types'

interface IHome {
  main: IMain
  home: IHomeData
}

export default function Home({main, home}: IHome) {

  const title = `${main.attributes.title} | ${main.attributes.subtitle}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Page containing articles, publications and projects by Vincent Guigues" />
      </Head>
      <main className="p-5 md:p-10">
        <section className='flex mb-8'>
          <Image
            width={home.attributes.profile_picture.width}
            height={home.attributes.profile_picture.height}
            src={home.attributes.profile_picture.url}
            alt="Vincent Guigues"
            priority
            className='mr-5'
          />
          <p className='text-base'>{home.attributes.about}</p>
        </section>
        <hr className='border-gray-300'/>
        <section className='flex my-8'>
          <address>
            <h3 className='text-xl font-medium'>Contact</h3>
            {!!home.attributes.email && <p className='my-1'>Email: <a className="text-blue-700" href={`mailto:${home.attributes.email}`}>{home.attributes.email}</a></p>}
            {!!home.attributes.phone && <p className='my-1'>Phone: <a className="text-blue-700" href={home.attributes.phone_link}>{home.attributes.phone}</a></p>}
            {!!home.attributes.address &&<p className='my-1'>Address: <a className="text-blue-700" href={home.attributes.address_link} target='_blank'>{home.attributes.address}</a></p>}
          </address>
        </section>
      </main>
    </>
  )
}

export async function getServerSideProps({ res }: {req: NextApiRequest, res: NextApiResponse}) {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=59'
  )

  try {

    const [main, home] = await Promise.all([
      fetch(`${process.env.API_PATH}/main?populate=*`).then(main => main.json()),
      fetch(`${process.env.API_PATH}/home?populate=*`).then(home => home.json())
    ]).then(all => all.map(a => a.data))

    if(main?.attributes?.background?.data){
      main.attributes.background = main.attributes.background.data.attributes
    }

    if(home?.attributes?.profile_picture?.data){
      home.attributes.profile_picture = home.attributes.profile_picture.data.attributes
    }

    return {
      props: {
        main,
        home
      },
    }
  } catch(err){
    console.error(err);
  }

  return {
    props: {}
  }
  
}
