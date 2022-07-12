import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
//Google Authentication wrap with all appliaction in this project
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

//change to es6 
const MyApp = ({ Component, pageProps }: AppProps) => {

  //============= ERROR Checking ====================
  //note that SSR stand for Server Side Rendering
  const [isSSR, setIsSSR] = useState(true);

  //the useEffect will only run at the start
  useEffect(() => {
    setIsSSR(false);
  }, [])

  if(isSSR) return null;
  // ================= End of checking ==============

  return (
    <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}>
      <Navbar />
      <div className="flex gap-6 md:gap-20">
        <div className="h-[92vh] overflow-hidden xl:hover:overflow-auto">
           <Sidebar />
        </div>
        <div className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
            <Component {...pageProps} />
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default MyApp
