"use client"
import { useEffect, useRef, useState } from "react"
import { useSession } from 'next-auth/react';
import { stat } from "fs";
import { Hearts } from "react-loader-spinner";
import Link from "next/link";
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { useRouter } from "next/router";
export default function Note({params}:{params:{noteid:string}}){
const { data: session,status} = useSession() 
const[title,settitle]=useState("Title")
const [content,setContent]=useState("")
const [loader,setloader]=useState(true)
const [socket, setsocket] = useState<Socket | null>(null)
const router=useRouter()
const noteid1=router.query.noteid??""
const [Noteidaftersaving,setnoteid]=useState("")





const socketInitializer = async () => {
 
  const connection = io()
console.log(connection)
 setsocket(connection)
}
socket?.on('connect_error',async (err:Error) =>{
  console.log(err)
  await fetch('/api/socket')})

async function savenotes(noteid:string) {
  
    const response = await fetch("/api/notesave",{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({noteid:noteid,userid:session?.user?.email
        
        })})
        const data=await response.json()
        console.log(data)
setnoteid(data.post.id)
settitle(data.post.title)
setContent(data.post.content)
setloader(false)
}    
    
useEffect(
  ()=>{
  
if(status=="authenticated" )
 { 
//  socketInitializer()
  savenotes(noteid1 as string)
   console.log("inside-effect")
}
   
  }   
    ,[status])

async function savedata(){
    
    await fetch("/api/savedata",{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({noteid:noteid1,userid:session?.user?.email
        ,title:title,content:content
        })})
        console.log("data saved!")
        
}


return (
<div>
{loader?
  <div className="flex items-center justify-center h-screen">
  <div className="block text-center">
    <h1 className="my-1 sm:text-4xl text-xl font-semibold text-[#D7EDE9]">Creating your space...</h1>
    <Hearts
      height="140"
      width="140"
      color="#4fa94d"
      ariaLabel="hearts-loading"
      wrapperStyle={{}}
      wrapperClass="flex items-center justify-center"
      visible={true}
    />
  </div>
</div>
  :<div className="my-6">


<div className="flex flex-col items-center gap-5  justify-center">
    <input value={title} onChange={(e)=>{
        const value=e.target.value
      
       savedata()
      
        settitle(e.target.value)}}  className="block px-2 text-4xl placeholder:text-white border-0 focus:border-none text-center text-white bg-black min-w-72 h-fit min-h-16 w-fit" type="text" ></input>
<textarea value={content} onChange={(e)=>{ const value=e.target.value;  if (value[value.length - 1] === ' '||value[value.length - 1] === '.') {
   savedata()
  }setContent(e.target.value)}} id="message" className="h-fit p-2.5 min-w-[80%] sm:min-h-[500px] w-fit font-semibold  text-2xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>

 <Link href="/home"> <button className="my-4 hover:text-black text-white border-white border font-semibold hover:bg-white px-4 rounded-md py-2 block mx-auto">{'BACK =>'} </button></Link>
</div>
</div>
}

</div>






)
}












