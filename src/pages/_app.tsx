import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import {SocketProvider} from '@/context/socket'
import {PostProvider} from '@/context/getPosts'
import { ToastContainer} from 'react-toastify';
import { Provider } from 'react-redux';
import store  from '../redux/store'
import 'react-toastify/dist/ReactToastify.css';
export default function App({ Component, pageProps }: AppProps) {
  return(
  <SessionProvider>
    <PostProvider>
    <SocketProvider>
      <Provider store={store}>
  <Component {...pageProps} />
  <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </Provider>
        
  </SocketProvider>
  </PostProvider>
  </SessionProvider>)
}
