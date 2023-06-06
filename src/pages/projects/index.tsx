import Head from "next/head"
import type { NextApiResponse } from 'next'
import { IMain, IProject } from "@/types"


interface IProjects {
    main: IMain
    projects: IProject[]
  }

export default function Projects({projects}: IProjects) {
  return (
    <>
        <Head>
            <title>Vincent Guigues | Projects</title>
        </Head>
        <main className="px-10 w-full max-w-2xl m-auto">
            <section>
                <h2>Projects</h2>
                <ul>
                    {projects.map(p => (
                        <li key={p.id} className="mb-10">
                            <div className="font-semibold">{p.name}</div>
                            <div>{p.description}</div>
                            {!!p.link && 
                                <span><a className="block my-1" href={p.link} target="_blank">View Project</a></span>
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
        const [main, projects] = await Promise.all([
            fetch(`${process.env.API_PATH}/main?populate=*`).then(main => main.json()),
            fetch(`${process.env.API_PATH}/project?populate=*`).then(projects => projects.json()),
        ]).then(all => all.map(a => a.data ))

        if(main?.attributes?.background?.data){
            main.attributes.background = main.attributes.background.data.attributes
        }
      
        return {
            props: {
            main,
            projects: projects?.attributes?.project || []
            },
        }
    } catch(err){
      console.error(err);
    }

    return {
        props: {}
    }
    
  }
