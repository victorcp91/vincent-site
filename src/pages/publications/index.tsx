import Head from "next/head"
import type { NextApiResponse } from 'next'
import { IMain, IPreprint, IPublication } from "@/types"


interface IPublications {
    main: IMain
    preprints: IPreprint[]
    publications: IPublication[]
  }

export default function publications({ preprints, publications}: IPublications) {

    const getDetails = (p: IPublication): string => {
        const details: string[] = [];
        if (p.attributes.pages){
            details.push(`Pages: ${p.attributes.pages}`)
        }
        if(p.attributes.issue){
            details.push(`Issue: ${p.attributes.issue}`)
        }
        if(p.attributes.volume){
            details.push(`Volume: ${p.attributes.volume}`)
        }
        return details.join(', ')
    }

    return (
        <>
            <Head>
                <title>Vincent Guigues | Publications</title>
                <meta name="description" content="Page containing publications by Vincent Guigues"/>
            </Head>
            <main className="px-10 w-full max-w-2xl m-auto">
                <section>
                    <h2>Preprints</h2>
                    <ul>
                        {preprints.map(p => (
                            <li key={p.id} className="mb-10">
                                <div className="font-semibold [&>span]:font-normal">{p.attributes.title}
                                    <span> {!!p.attributes.year && `(${p.attributes.year})`}</span>
                                    {!!p.attributes.file?.url && 
                                        <span> [<a href={p.attributes.file.url} target="_blank">view</a>]</span>
                                    }
                                </div>
                                <div>{p.attributes.author}</div>
                                {!p.attributes.file?.url && p.attributes.link && 
                                    <span> [<a href={p.attributes.link} target="_blank">view</a>]</span>
                                }
                            </li>
                        ))}
                    </ul>
                </section>
                <hr />
                <section>
                    <h2>Publications</h2>
                    <ul>
                        {publications.map(p => (
                            <li key={p.id} className="mb-10">
                                <div className="font-semibold [&>span]:font-normal">{p.attributes.title}
                                    <span> {!!p.attributes.year && `(${p.attributes.year})`}</span>
                                    {!!p.attributes.file?.url &&
                                    <span> [<a className="text-blue-600" href={p.attributes.file.url} target="_blank">view</a>]</span>
                                    }
                                    {!p.attributes.file?.url && p.attributes.link && 
                                        <span> [<a className="text-blue-600" href={p.attributes.link} target="_blank">view</a>]</span>
                                    }
                                </div>
                                <div className="mb-1">{p.attributes.author}</div>
                                <div>
                                    {getDetails(p)}
                                </div>            
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
            fetch(`${process.env.API_PATH}/preprints?populate=*&pagination[pageSize]=100&sort[0]=year%3Adesc`).then(preprints => preprints.json()),
            fetch(`${process.env.API_PATH}/publications?populate=*&pagination[pageSize]=100&sort[0]=year%3Adesc`).then(publications => publications.json())
        ]).then(all => all.map(a => a.data))

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
