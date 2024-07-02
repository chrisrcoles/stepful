import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {SlotsProvider} from '../contexts/slots-context';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SlotsProvider>
      <Component {...pageProps} />
    </SlotsProvider>
  )
}


