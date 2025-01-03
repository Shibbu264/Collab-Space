"use client"

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';
import Leftbar from '../components/leftbar';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Loader from '@/components/loaders/Loader';


const Home1 = () => {
  interface Post {
    id: string;
    title: string;
  }

  interface User {
    profilepic: string;
    posts?: Post[];
  }

  const [open, setOpen] = useState<boolean>(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState<string>('');
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [CollabPosts,setCollabPosts]=useState<Post[] | null>(null)
  const unique_id = uuid().slice(0, 8);
  const [loading, setLoading] = useState(true)
  const [value, setvalue] = useState(true)

  async function deleteNote(noteid: string) {
    const updatedPosts = user?.posts?.filter((posti) => posti.id !== noteIdToDelete) ?? [];
    setUser({ ...user, posts: updatedPosts, profilepic: user?.profilepic ?? '' });
    setOpen(false)
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
        alert(data.message.name + "  Please Refresh!");
      }
      else {
        console.log(data);
        setUser(data.user);
        setCollabPosts(data.collaboratedPosts)
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

  if (status === 'loading' || loading) return (<Loader/>)
  else {
    if (status==="authenticated") {
      return (
        <div className='text-3xl max-sm:px-4'>
          <h1 className='my-4 max-sm:text-xl flex font-semibold sm:justify-start justify-center line-clamp-1 '>Hi {session.user?.name} </h1>

          <div className='grid grid-cols-5 sm:hidden items-center  my-16  '>
            <span className={value ? 'col-span-2 text-xl text-[#52df54] font-semibold  ' : 'mr-6 text-xl text-white font-medium  '}>Create notes!</span>
            <div className='scale-125 ml-4 mt-1'><label className="relative inline-flex items-center mr-5 cursor-pointer">

              <input type="checkbox" onClick={() => { setvalue(!value) }} value="" className="sr-only peer col-span-1" />

              <div className="w-11 h-6   rounded-full border-[#2ea430] border-2 peer   peer-focus:ring-4 peer-focus:ring-[#2ea430] dark:peer-focus:[#2ea430] peer-checked:after:translate-x-full  after:content-[''] after:absolute  after:left-[2px] after:bg-white after: after:border after:rounded-full after:h-5 after:w-5 after:transition-all  "></div>

            </label></div><span className={value ? 'ml-6 col-span-2 text-xl text-white font-semibold  ' : ' ml-6 text-xl text-[#52df54] font-semibold  '}>View notes!</span>
          </div>

    <div className='max-sm:hidden'><Leftbar collabposts={CollabPosts} user={user} setOpen={setOpen} setNoteId={setNoteIdToDelete} /></div> 
         
         {/* {Mobile Friendly} */}
         {value ?


        <div className='px-4'>
              <br />
              <div className='flex flex-col px-4 items-center gap-12 sm:hidden mt-24 mx-auto w-fit h-28   '>
                <Link href={'/space/' + unique_id}>
                  <img className='w-32 rounded-lg h-32 block mx-auto' src="/icon.jpg" />
                  <button className=' block text-lg mx-auto border my-12   bg-black text-white hover:bg-white hover:text-black font-semibold  hover:bg- px-2 py-2 rounded-lg'>
                    Create a new space !
                  </button>
                </Link>
              </div>

            </div> : <Leftbar user={user} collabposts={CollabPosts} setNoteId={setNoteIdToDelete} setOpen={setOpen}  />
          }
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>Confirm Delete</DialogTitle>
            <DialogContent>
              <p className='text-xl font-semibold'>Are you sure you want to delete this note?</p>
            </DialogContent>
            <DialogActions>
              <Button variant="contained"
  color="info"  onClick={() => setOpen(false)}>Cancel</Button>
              <Button  variant="contained"
  color="error"
   onClick={() => { deleteNote(noteIdToDelete) }} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <div className='hidden sm:block'>
            <br />

            <div className='block mx-auto w-fit h-fit top-[55%]   absolute left-0 right-0'>
              <Link href={'/space/' + unique_id}>
                <div className='mb-36 bg-transparent sm:flex text-[320px]'>+</div>
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