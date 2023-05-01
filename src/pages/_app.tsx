import Header from '@/components/Header'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'


export default function App({ Component, pageProps }: AppProps) {
  return <>
    {!!pageProps.main && <Header
      title={pageProps.main.attributes.title}
      subtitle={pageProps.main.attributes.subtitle}
      bgImage={pageProps.main.attributes.background?.url}
    />}
    <Component {...pageProps} />
  </>
}
