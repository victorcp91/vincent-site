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

export default function CV({main, cv}: ICV) {
  console.log(main, cv)
  return (
    <div className="p-5 md:p-10">
        <Head>
            <title>Vincent Guigues | CV</title>
         </Head>
          {cv.section.map((s,i) => <div key={s.id} >
            <section className="flex my-5 gap-10">
              {!!cv.profile_picture.url && (
                <Image
                  className={`min-w-[${cv.profile_picture.width}px] max-w-[${cv.profile_picture.width}px] max-h-full h-full`}
                  width={cv.profile_picture.width}
                  height={cv.profile_picture.height}
                  src={cv.profile_picture.url}
                  alt="Vincent Guigues"
              />)}
              <div>
                <h3 className="font-bold mb-5 text-xl leading-[13px]">{s.title}</h3>
                <ReactMarkdown>{s.text}</ReactMarkdown>
              </div>
              
            </section>
            <hr className='border-gray-300'/>
          </div>)}
          <section className="my-5">
            <h3 className="font-bold mb-5 text-xl">{cv.history.title}</h3>
            <ul>
              {cv.history.topic.map(t => <li key={t.id} className="flex mb-10 gap-10">
                <div className="min-w-[150px] text-center">{t.date}</div>
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

