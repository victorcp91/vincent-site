import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head"
import ReactMarkdown from "react-markdown";

interface IPeople {
  main: any
  people: {
    section: {
      id: number;
      title: string;
      text: string;
    }[]
  }
}

export default function People({people}: IPeople) {
  return (
    <div className="px-10 w-full max-w-2xl m-auto">
        <Head>
            <title>Vincent Guigues | People</title>
        </Head>
        <div>
        {people.section.map((s, i) => <div key={s.id} >
          <section key={s.id}  className="my-5">
            <h2>{s.title}</h2>
            <ReactMarkdown>{s.text}</ReactMarkdown>
          </section>
          {people.section.length - 1 !== i && (
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

    const [main, people] = await Promise.all([
      fetch(`${process.env.API_PATH}/main?populate=*`).then(main => main.json()),
      fetch(`${process.env.API_PATH}/people?populate=*`).then(people => people.json())
    ]).then(all => all.map(a => a.data))

    if(main?.attributes?.background?.data){
      main.attributes.background = main.attributes.background.data.attributes
    }

    return {
      props: {
        main,
        people: people.attributes
      },
    }
  } catch(err){
    console.error(err);
  }

  return {
    props: {}
  }
}

