import Image from 'next/image'
import { Inter } from 'next/font/google'
import Home1 from './home'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='!bg-primary-gradient'>
  <Home1/> 
  </div>
  )
}
