"use client"
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';


 
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const unique_id = uuid().slice(0, 8);
  const [loading, setLoading] = useState(true)
  const [value,setvalue]=useState(true)


  useEffect(() => {
      setLoading(false)
    

  }, [status, session.user.email]);

  if (status == "unauthenticated") {
    window.location.replace('/signin');
  }

  if (status === 'loading' || loading) return (<div className='flex items-center justify-center h-screen'>



    <div className='my-12 flex flex-col items-center text-xl sm:text-3xl text-[#D7EDE9] font-bold text-center'>
    
      <Hearts
        height="140"
        width="140"
        color="#4fa94d"
        ariaLabel="hearts-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
     

    </div>
  </div>)
  else {
    if (session) {
      return (
        <div className='text-3xl  '>
  <h1 className='my-4 flex font-semibold sm:justify-start justify-center ml-[2%]'>Hi {session.user?.name} </h1>
        </div>

        
      );
    }
  };

export default Home1;
