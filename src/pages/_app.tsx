import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import {SocketProvider} from '@/context/socket'
export default function App({ Component, pageProps }: AppProps) {
  return(
  <SessionProvider>
    <SocketProvider>
  <Component {...pageProps} />
  </SocketProvider>
  </SessionProvider>)
}
