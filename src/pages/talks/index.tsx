import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import ReactMarkdown from "react-markdown";

interface ITalks {
  main: any
  talks: {
    section: {
      id: number;
      title: string;
      text: string;
    }[]
  }
}

export default function Talks({main, talks}: ITalks) {
  
  return (
    <div className="p-5 md:p-10 w-full max-w-2xl m-auto">
        <Head>
            <title>Vincent Guigues | Talks</title>
         </Head>
        <div>
        {talks.section.map((s,i) => <>
          <section key={s.id}  className="my-5">
            <h3 className="font-bold mb-5 text-xl">{s.title}</h3>
            <ReactMarkdown>{s.text}</ReactMarkdown>
          </section>
          {talks.section.length - 1 !== i && (
            <hr className='border-gray-300'/>
          )}
        </>)
        }
        </div>
    </div>
  )
}

export async function getServerSideProps({ res }: {req: NextApiRequest, res: NextApiResponse}) {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=59'
  )

  try {

    const [main, talks] = await Promise.all([
      fetch(`${process.env.API_PATH}/main?populate=*`).then(main => main.json()),
      fetch(`${process.env.API_PATH}/talk?populate=*`).then(talks => talks.json())
    ]).then(all => all.map(a => a.data))

    if(main?.attributes?.background?.data){
      main.attributes.background = main.attributes.background.data.attributes
    }

    return {
      props: {
        main,
        talks: talks.attributes
      },
    }
  } catch(err){
    console.error(err);
  }

  return {
    props: {}
  }
}
