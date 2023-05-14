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
      <main className="px-10 pb-2 w-full max-w-2xl m-auto">
        <h2>Presentation</h2>
        <section className='flex mb-3'>
          <div className={`border border-black p-1 mr-3 h-fit min-w-fit [&>img]:min-w-fit`}>
            <Image
                  className={`h-full`}
                  width={home.attributes.profile_picture.width}
                  height={home.attributes.profile_picture.height}
                  src={home.attributes.profile_picture.url}
                  alt="Vincent Guigues"
              />
          </div>
          <p>{home.attributes.about}</p>
        </section>
        <hr />
        <h2>Contact information</h2>
        <section className='flex my-3'>
          <div className='mr-5'>
            {!!home.attributes.email && <p className='mb-1'>Email</p>}
            {!!home.attributes.phone && <p className='mb-1'>Phone</p>}
            {!!home.attributes.address && <p className='mb-1'>To find me</p>}
          </div>
          <div className='flex flex-col'>
            {!!home.attributes.email && <a className='mb-1' href={`mailto:${home.attributes.email}`}>{home.attributes.email}</a>}
            {!!home.attributes.phone && <a className='mb-1' href={home.attributes.phone_link}>{home.attributes.phone}</a>}
            {!!home.attributes.address &&  <a className='mb-1' href={home.attributes.address_link} target='_blank'>{home.attributes.address}</a>}
          </div>
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
