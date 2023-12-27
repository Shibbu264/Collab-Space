"use client"
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import DeleteIcon from '@mui/icons-material/Delete';

import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import { Hearts } from 'react-loader-spinner'


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
        alert(data.message.name);
      }
      console.log(data.user.posts);
      setUser(data.user);
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
        <div className='text-3xl'>
          {user?.profilepic && (
            <div className='flex sm:justify-start sm:items-start  items-center flex-col'>
              <img className='my-3 block ml-[2%] w-16 h-16 rounded-full p-3 border-2 border-white' src={user.profilepic} />
              <h1 className='my-4 ml-[2%]'> {session.user?.name} </h1>
              <h1 className='ml-[2%] font-bold text-blue-400 my-2'>My Notes</h1>
              <ul className='ml-[2%]'>
                {user.posts?.map((post, index) => (
                  <div className='flex sm:justify-start items-center justify-center my-3 gap-6' key={post.id}>
                    <Link href={'/newnotes/' + post.id}>
                      <li className=' hover:scale-105'>{post.title}</li>
                    </Link>
                    <button
                      onClick={() => {
                        deleteNote(post.id);
                        const updatedPosts = user.posts?.filter((posti) => posti.id !== post.id) ?? [];
                        setUser({ ...user, posts: updatedPosts });
                      }}
                    >
                      <DeleteIcon className='cursor-pointer hover:text-red-500' />
                    </button>
                   
                  </div>
                ))}
              </ul>
              <button
                      className=' ml-[2%] bg-white text-blue-500 hover:text-white hover:bg-blue-500 px-2 py-2 rounded-xl'
                      onClick={() => signOut().then(() => window.location.replace('/signin'))}
                    >
                      Sign out
                    </button>
            </div>
          )}
          <br />
          <Link href={'/newnotes/' + unique_id}>
            <button className='mt-6 block mx-auto bg-white text-blue-500 font-semibold hover:text-white hover:bg-green-500 px-2 py-2 rounded-xl'>
              Create notes!
            </button>
          </Link>

        </div>
      );
    }
  }
};

export default Home1;
