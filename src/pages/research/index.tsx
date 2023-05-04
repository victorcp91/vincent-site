import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from 'next'
import ReactMarkdown from 'react-markdown'

interface IResearch {
  main: any
  research: {
    section: {
      id: number;
      title: string;
      text: string;
    }[]
  }
}

export default function Research({main, research}: IResearch) {
  console.log(main, research)

  return (
    <div className="p-5 md:p-10">
      <Head>
        <title>Vincent Guigues | Research</title>
      </Head>
      {research.section.map((s,i) => <div key={s.id}>
        <section className="my-5">
          <h3 className="font-bold my-5 text-xl">{s.title}</h3>
          <ReactMarkdown>{s.text}</ReactMarkdown>
        </section>
        {research.section.length - 1 !== i && (
          <hr className='border-gray-300'/>
        )}
      </div>)}
    </div>
  )
}


export async function getServerSideProps({ res }: {req: NextApiRequest, res: NextApiResponse}) {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=59'
  )

  try {

    const [main, research] = await Promise.all([
      fetch(`${process.env.API_PATH}/main?populate=*`).then(main => main.json()),
      fetch(`${process.env.API_PATH}/research?populate=*`).then(research => research.json())
    ]).then(all => all.map(a => a.data))

    if(main?.attributes?.background?.data){
      main.attributes.background = main.attributes.background.data.attributes
    }

    return {
      props: {
        main,
        research: research.attributes
      },
    }
  } catch(err){
    console.error(err);
  }

  return {
    props: {}
  }
}