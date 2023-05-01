import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from 'next'

interface IResearch {
  main: any
  preprint: any
}

export default function research({main, preprint}: IResearch) {

  console.log(main, preprint)

  return (
    <div>
      <Head>
        <title>Vincent Guigues | Research</title>
      </Head>
      research
    </div>
  )
}


export async function getServerSideProps({ req, res }: {req: NextApiRequest, res: NextApiResponse}) {

  // res.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=1800, stale-while-revalidate=59'
  // )

  try {
    const [main, preprints] = await Promise.all([
      fetch(`${process.env.API_PATH}/main`).then(main => {
        return main.json()
      }),
      fetch(`${process.env.API_PATH}/preprint?populate=*`).then(pre => {
        return pre.json()
      })
    ]).then(all => all.map(a => a.data.attributes))

    return {
      props: {
        main,
        preprints
      },
    }
  } catch(err){
    console.error(err);
  }

  return {
    props: {}
  }
  
}