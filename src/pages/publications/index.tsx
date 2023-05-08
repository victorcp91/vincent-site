import Head from "next/head"
import type { NextApiResponse } from 'next'
import { IMain, IPreprint, IPublication } from "@/types"


interface IPublications {
    main: IMain
    preprints: IPreprint[]
    publications: IPublication[]
  }

export default function publications({ preprints, publications}: IPublications) {
  return (
    <>
        <Head>
            <title>Vincent Guigues | Publications</title>
            <meta name="description" content="Page containing publications by Vincent Guigues"/>
        </Head>
        <main className="p-5 md:p-10 w-full max-w-2xl m-auto">
            <section>
                <h3 className="font-bold mb-5 text-xl">Preprints</h3>
                <ul>
                    {preprints.map(p => (
                        <li key={p.id} className="mb-10 list-none">
                            <div className="font-semibold text-lg">{p.attributes.title}</div>
                            <div className="text-sm">{p.attributes.author} | {p.attributes.year}</div>
                            {!!p.attributes.file?.url && 
                                <a className="text-blue-600 mr-5" href={p.attributes.file.url} target="_blank">Visualizar</a>
                            }
                            {!p.attributes.file?.url && p.attributes.link && 
                                <a className="text-blue-600 mr-5" href={p.attributes.link} target="_blank">Visualizar</a>
                            }
                        </li>
                    ))}
                </ul>
            </section>
            <hr className='border-gray-300' />
            <section>
                <h3 className="font-bold my-5 text-xl">Publication</h3>
                <ul>
                    {publications.map(p => (
                        <li key={p.id} className="mb-10 list-none">
                            <div className="font-semibold text-lg">{p.attributes.title}</div>
                            <div className="[&>div]:text-sm">
                                {!!p.attributes.pages && <div>Pages: {p.attributes.pages}</div>}
                                {!!p.attributes.issue && <div>Issue: {p.attributes.issue}</div>}
                                {!!p.attributes.volume && <div>Volume: {p.attributes.volume}</div>}
                            </div>
                            <div className="text-sm mb-1">{p.attributes.author} | {p.attributes.year}</div>
                            {!!p.attributes.file?.url &&
                                <a className="mr-5 text-blue-600" href={p.attributes.file.url} target="_blank">View</a>
                            }
                            {!p.attributes.file?.url && p.attributes.link && 
                                <a className="mr-5 text-blue-600" href={p.attributes.link} target="_blank">View</a>
                            }
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    </>
  )
}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=1800, stale-while-revalidate=59'
    )
  
    try {
        const [main, preprints, publications] = await Promise.all([
            fetch(`${process.env.API_PATH}/main?populate=*`).then(main => main.json()),
            fetch(`${process.env.API_PATH}/preprints?populate=*`).then(preprints => preprints.json()),
            fetch(`${process.env.API_PATH}/publications?populate=*`).then(publications => publications.json())
        ]).then(all => all.map(a => a.data ))

        if(main?.attributes?.background?.data){
            main.attributes.background = main.attributes.background.data.attributes
        }

        preprints.forEach((_: any, index: number) => {
            if(preprints[index]?.attributes?.file?.data?.attributes) {
                preprints[index].attributes.file =  preprints[index].attributes.file.data.attributes
            } else {
                preprints[index].attributes.file =  null
            }
        });

        publications.forEach((_: any, index: number) => {
            if(publications[index]?.attributes?.file?.data?.attributes) {
                publications[index].attributes.file =  publications[index].attributes.file.data.attributes
            } else {
                publications[index].attributes.file =  null
            }
        });
      
        return {
            props: {
            main,
            preprints, 
            publications
            },
        }
    } catch(err){
      console.error(err);
    }

    return {
        props: {}
    }
    
  }
