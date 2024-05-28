
import DeleteIcon from '@mui/icons-material/Delete';
import {  signOut } from 'next-auth/react';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Button } from '@mui/material';
export default function Leftbar ({user,setOpen,setNoteId,collabposts}){
return ( <div>
    {user?.profilepic && (
      <div className='sm:flex sm:justify-start sm:items-start    items-center flex-col'>
       
      
        <h1 className='ml-[2%] font-bold text-blue-400 my-2'>Your Space</h1>
        <ul className='ml-[2%]'>
          {user.posts?.map((post, index) => (
            <div className='flex border px-2 w-fit py-1 rounded-lg sm:justify-start items-center bg-black text-white-500 hover:text-black   hover:bg-white justify-center my-3 gap-6' key={post.id}>
              <Link href={'/newnotes/' + post.id}>
                <li className=' '>{post.title}</li>
              </Link>
              <button
                onClick={() => {
                  setOpen(true)
                  setNoteId(post.id)
                }}
              >
                <DeleteIcon className='cursor-pointer hover:text-red-500' />
              </button>
             
            </div>
          ))}
 <h1 className='ml-[2%] font-bold text-blue-400 my-2'>Collabs</h1>
{collabposts?.map((post) => (
            <div className='flex border px-2 w-fit py-1 rounded-lg sm:justify-start items-center bg-black text-white-500 hover:text-black   hover:bg-white justify-center my-3 gap-6' key={post.id}>
              <Link href={'/newnotes/' + post.id}>
                <li className=' '>{post.title}</li>
              </Link>
              <button
                onClick={() => {
                  setOpen(true)
                  setNoteId(post.id)
                }}
              >
                <DeleteIcon className='cursor-pointer hover:text-red-500' />
              </button>
             
            </div>
          ))}
               <Button
  variant="contained"
  color="primary"
  size="large"
  onClick={() => signOut().then(() => window.location.replace('/signin'))}
  startIcon={<ExitToAppIcon />}
>
  Sign out
</Button>
        </ul>
   
      </div>
    )}
    </div>)
}