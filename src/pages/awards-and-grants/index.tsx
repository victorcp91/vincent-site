import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import ReactMarkdown from "react-markdown";


interface ITeaching {
  main: any
  awards: {
    Section: {
      id: number;
      title: string;
      text: string;
    }[]
  }
}

export default function Teaching({awards}: ITeaching) {
  return (
    <div className="px-10 w-full max-w-2xl m-auto">
      <Head>
        <title>Vincent Guigues | Awards and Grants</title>
      </Head>
      <div>
        {awards.Section.map((s,i) => <div key={s.id}>
          <section className="mb-5">
            <h2>{s.title}</h2>
            <ReactMarkdown>{s.text}</ReactMarkdown>
          </section>
          {awards.Section.length - 1 !== i && (
            <hr />
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

    const [main, awards] = await Promise.all([
      fetch(`${process.env.API_PATH}/main?populate=*`).then(main => main.json()),
      fetch(`${process.env.API_PATH}/award-and-grant?populate=*`).then(awards => awards.json())
    ]).then(all => all.map(a => a.data))

    if(main?.attributes?.background?.data){
      main.attributes.background = main.attributes.background.data.attributes
    }

    return {
      props: {
        main,
        awards: awards.attributes
      },
    }
  } catch(err){
    console.error(err);
  }

  return {
    props: {}
  }
}

