import { NextApiRequest, NextApiResponse } from "next"
import Head from "next/head"
import Image from "next/image"
import ReactMarkdown from "react-markdown"


interface ICV {
  main: any
  cv: {
    profile_picture: {
      url: string
      width: number
      height: number
    }
    section: {
      id: number
      title: string
      text: string
    }[]
    history: {
      title: string
      topic: {
        id: number
        date: string
        content: string
      }[]
    }
  }
}

export default function CV({cv}: ICV) {
  return (
    <div className="px-10 w-full max-w-2xl m-auto">
        <Head>
            <title>Vincent Guigues | CV</title>
         </Head>
          {cv.section.map((s) => <div key={s.id} >
            <h2>{s.title}</h2>
            <section className="flex my-5 gap-3">
              <div>
                <ReactMarkdown>{s.text}</ReactMarkdown>
              </div>
              {!!cv.profile_picture.url && (
                <div className='border border-black p-1 mr-3'>
                  <Image
                    className={`min-w-[${cv.profile_picture.width}px] max-w-[${cv.profile_picture.width}px] max-h-full h-full`}
                    width={cv.profile_picture.width}
                    height={cv.profile_picture.height}
                    src={cv.profile_picture.url}
                    alt="Vincent Guigues"
                />
              </div>)}
            </section>
            <hr />
          </div>)}
          <section className="my-5">
            <h2>{cv.history.title}</h2>
            <ul className="p-0">
              {cv.history.topic.map(t => <li key={t.id} className="flex mb-10 gap-10">
                <div className="min-w-[90px]">{t.date}</div>
                <div><ReactMarkdown>{t.content}</ReactMarkdown></div>
              </li> )}
            </ul>
            
          </section>
    </div>
  )
}

export async function getServerSideProps({ res }: {req: NextApiRequest, res: NextApiResponse}) {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=59'
  )

  try {

    const [main, cv] = await Promise.all([
      fetch(`${process.env.API_PATH}/main?populate=*`).then(main => main.json()),
      fetch(`${process.env.API_PATH}/cv?populate[profile_picture]=*&populate[history][populate]=*&populate[section]=*`).then(cv => cv.json())
    ]).then(all => all.map(a => a.data))

    if(main?.attributes?.background?.data){
      main.attributes.background = main.attributes.background.data.attributes
    }

    if(cv?.attributes?.profile_picture?.data){
      cv.attributes.profile_picture = cv.attributes.profile_picture.data.attributes
    }

    return {
      props: {
        main,
        cv: cv.attributes
      },
    }
  } catch(err){
    console.error(err);
  }

  return {
    props: {}
  }
}

