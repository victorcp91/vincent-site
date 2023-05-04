import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import ReactMarkdown from "react-markdown";


interface ITeaching {
  main: any
  teaching: {
    section: {
      id: number;
      title: string;
      text: string;
    }[]
  }
}

export default function Teaching({main, teaching}: ITeaching) {
  return (
    <div className="p-5 md:p-10">
      <Head>
        <title>Vincent Guigues | Teaching</title>
      </Head>
      <div>
        {teaching.section.map((s,i) => <div key={s.id}>
          <section className="my-5">
            <h3 className="font-bold mb-5 text-xl">{s.title}</h3>
            <ReactMarkdown>{s.text}</ReactMarkdown>
          </section>
          {teaching.section.length - 1 !== i && (
            <hr className='border-gray-300'/>
          )}
        </div>)}
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

    const [main, teaching] = await Promise.all([
      fetch(`${process.env.API_PATH}/main?populate=*`).then(main => main.json()),
      fetch(`${process.env.API_PATH}/talk?populate=*`).then(teaching => teaching.json())
    ]).then(all => all.map(a => a.data))

    if(main?.attributes?.background?.data){
      main.attributes.background = main.attributes.background.data.attributes
    }

    return {
      props: {
        main,
        teaching: teaching.attributes
      },
    }
  } catch(err){
    console.error(err);
  }

  return {
    props: {}
  }
}

