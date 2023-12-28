"use client"
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';


import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import { Hearts } from 'react-loader-spinner'
import Leftbar from './components/leftbar';


const Home1 = () => {
  interface Post {
    id: string;
    title: string;
    // Add other properties as needed
  }

  interface User {
    profilepic: string;
    posts?: Post[];
    // Add other properties as needed
  }
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const unique_id = uuid().slice(0, 8);
  const [loading, setLoading] = useState(true)
  const [value,setvalue]=useState(true)
  async function deleteNote(noteid: string) {
    await fetch('/api/deletenote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noteid: noteid }),
    });
  }

  useEffect(() => {
    async function fetchUserData(email: string) {
      const response = await fetch('/api/userdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      if (data.message) {
        alert(data.message.name+"  Please Refresh!");
      }
      else{
      console.log(data.user.posts);
      setUser(data.user);
      }
      setLoading(false)
    }

    if (status === 'authenticated') {
      const email = session?.user?.email;
      fetchUserData(email ?? '');
    }
  }, [status, session?.user?.email]);

  if (status == "unauthenticated") {
    window.location.replace('/signin');
  }

  if (status === 'loading' || loading) return (<div className='flex items-center justify-center h-screen'>



    <div className='my-12 flex flex-col items-center text-xl sm:text-3xl text-[#D7EDE9] font-bold text-center'>
      <h1>Welcome Overthinker!</h1>
      <Hearts
        height="140"
        width="140"
        color="#4fa94d"
        ariaLabel="hearts-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
      <h1 >Fetching your Thoughts.....</h1>

    </div>
  </div>)
  else {
    if (session) {
      return (
        <div className='text-3xl  '>
  <h1 className='my-4 flex font-semibold sm:justify-start justify-center ml-[2%]'>Hi {session.user?.name} </h1>
        
  <div className='flex sm:hidden items-center justify-center  my-16  '>
   <span className={value?'mr-6 text-xl text-[#52df54] font-semibold  ':'mr-6 text-xl text-white font-medium  '}>Create notes!</span>
   <div className='scale-125 ml-4 mt-1'><label className="relative inline-flex items-center mr-5 cursor-pointer">
 
  <input type="checkbox" onClick={()=>{setvalue(!value)}} value="" className="sr-only peer" />
  
  <div className="w-11 h-6  rounded-full border-[#2ea430] border-2 peer   peer-focus:ring-4 peer-focus:ring-[#2ea430] dark:peer-focus:[#2ea430] peer-checked:after:translate-x-full  after:content-[''] after:absolute  after:left-[2px] after:bg-white after: after:border after:rounded-full after:h-5 after:w-5 after:transition-all  "></div>
  
</label></div><span className={value?'ml-6 text-xl text-white font-semibold  ':' ml-6 text-xl text-[#52df54] font-semibold  '}>View notes!</span>
</div>
        
        
        {value?
        

          <div>
          <br />
        
            <div className='block mx-auto w-fit h-fit top-[55%]   absolute left-0 right-0'>
            <Link href={'/newnotes/' + unique_id}>
          <div className='mb-36 bg-transparent sm:flex     text-[320px]'>+</div>
            <button className=' block mx-auto border   bg-black text-white hover:bg-white hover:text-black font-semibold  hover:bg- px-2 py-2 rounded-xl'>  
              Create notes!
            </button>
            </Link>
            </div>
         
          </div>: <Leftbar session={session} user={user} deleteNote={deleteNote} setUser={setUser}/>
    }
     <div className='max-sm:hidden'>
          <br />
        
            <div className='block mx-auto w-fit h-fit top-[55%]   absolute left-0 right-0'>
            <Link href={'/newnotes/' + unique_id}>
          <div className='mb-36 bg-transparent sm:flex     text-[320px]'>+</div>
            <button className=' block mx-auto border   bg-black text-white hover:bg-white hover:text-black font-semibold  hover:bg- px-2 py-2 rounded-xl'>  
              Create notes!
            </button>
            </Link>
            </div>
         
          </div>

        </div>

        
      );
    }
  }
};

export default Home1;
