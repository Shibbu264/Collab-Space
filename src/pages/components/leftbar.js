
import DeleteIcon from '@mui/icons-material/Delete';
import { SessionContext, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Leftbar ({session,user,deleteNote,setUser}){

return ( <div>
    {user?.profilepic && (
      <div className='sm:flex sm:justify-start sm:items-start    items-center flex-col'>
       
      
        <h1 className='ml-[2%] font-bold text-blue-400 my-2'>Your Notes</h1>
        <ul className='ml-[2%]'>
          {user.posts?.map((post, index) => (
            <div className='flex border px-2 w-fit py-1 rounded-lg sm:justify-start items-center bg-black text-white-500 hover:text-black   hover:bg-white justify-center my-3 gap-6' key={post.id}>
              <Link href={'/newnotes/' + post.id}>
                <li className=' '>{post.title}</li>
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
                className=' my-3 ml-[2%] max-sm:block max-sm:mx-auto max-sm:mt-10 bg-black text-white-500 hover:text-black border  hover:bg-white px-2 h-12 rounded-xl'
                onClick={() => signOut().then(() => window.location.replace('/signin'))}
              >
                Sign out
              </button>
      </div>
    )}
    </div>)
}