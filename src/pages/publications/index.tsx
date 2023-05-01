import Head from "next/head"
import type { NextApiRequest, NextApiResponse } from 'next'
import { IMain, IPreprint, IPublication } from "@/types"


interface IPublications {
    main: IMain
    preprints: IPreprint[]
    publications: IPublication[]
  }

export default function publications({main, preprints, publications}: IPublications) {
  return (
    <>
        <Head>
            <title>Vincent Guigues | Publications</title>
        </Head>
        <main className="p-5 md:p-10 flex">
            <section className="flex-1 text-center">
                <h3 className="font-bold mb-5 text-xl">Preprints</h3>
                <ul>
                    {preprints.map(p => (
                        <li key={p.id} className="mb-10">
                            <div className="font-semibold text-lg">{p.attributes.title}</div>
                            <div className="text-sm">{p.attributes.author} | {p.attributes.year}</div>
                            {!!p.attributes.file?.url && <div>
                                <a className="text-blue-600 mr-5" href={p.attributes.file.url} target="_blank">Visualizar</a>
                                <a className="text-blue-600" href={p.attributes.file.url} download>Download</a>
                            </div>
                            }
                            {!p.attributes.file?.url && p.attributes.link && 
                                <div>
                                    <a className="text-blue-600 mr-5" href={p.attributes.link} target="_blank">Visualizar</a>
                                    <a className="text-blue-600" href={p.attributes.link} download>Download</a>
                                </div>
                            }
                        </li>
                    ))}
                </ul>
            </section>
            <section className="flex-1 text-center">
                <h3 className="font-bold mb-5 text-xl">Publication</h3>
                <ul>
                    {publications.map(p => (
                        <li key={p.id} className="mb-10">
                            <div className="font-semibold text-lg">{p.attributes.title}</div>
                            <div className="flex justify-center gap-5 [&>div]:text-sm">
                                {!!p.attributes.pages && <div>Pages: {p.attributes.pages}</div>}
                                {!!p.attributes.issue && <div>Issue: {p.attributes.issue}</div>}
                                {!!p.attributes.volume && <div>Volume: {p.attributes.volume}</div>}
                            </div>
                            <div className="text-sm mb-1">{p.attributes.author} | {p.attributes.year}</div>
                            {!!p.attributes.file?.url && <div className="[&>a]:text-blue-600">
                                <a className="mr-5" href={p.attributes.file.url} target="_blank">Visualizar</a>
                                <a href={p.attributes.file.url} download>Download</a>
                            </div>}
                            {!p.attributes.file?.url && p.attributes.link && 
                                <div className="[&>a]:text-blue-600">
                                    <a className="mr-5" href={p.attributes.link} target="_blank">Visualizar</a>
                                    <a href={p.attributes.link} download>Download</a>
                                </div>
                            }
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    </>
  )
}

export async function getServerSideProps({ req, res }: {req: NextApiRequest, res: NextApiResponse}) {

    // res.setHeader(
    //   'Cache-Control',
    //   'public, s-maxage=1800, stale-while-revalidate=59'
    // )
  
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
