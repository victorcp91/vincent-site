import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
	      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="canonical" href="https://www.vincentgyg.com/" />
        <meta name="description" content="This is the professional webpage of Vincent Guigues. Vincent Guigues is professor and researcher within the school of Applied Mathematics of FGV (Fundacao Getulio Vargas) university. He works on the theory of optimization (both deterministic optimization and stochastic optimization) and in statistics. He also works on real-life applications which need optimization and statistical techniques." />
      </Head>
      <body className="bg-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
