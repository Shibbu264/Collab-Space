"use client"
import { useEffect, useRef, useState } from "react"
import { useSession } from 'next-auth/react';
import { Hearts } from "react-loader-spinner";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSocket } from "@/context/socket";
import { showToast } from "../components/toast";
import { FaTrash } from "react-icons/fa"
import ReactPlayer from 'react-player';

export default function Note() {

  const { data: session, status } = useSession()
  const [title, settitle] = useState("Title")
  const [showcontent, setshowcontent] = useState(false)
  const [contents, setContent] = useState([])
  const [links, setlink] = useState([])
  const [newContent, setNewContent] = useState('');
  const [newLink, setNewLink] = useState('');
  const [loader, setloader] = useState(true)
  const router = useRouter()
  const noteid1 = router.query.noteid
  const [Noteidaftersaving, setnoteid] = useState("")
  const [addoption, setaddoption] = useState(false)
  const ab = useRef(false)
  const [Collaborators, setCollaborators] = useState('');
  const [firstload, setloaded] = useState(false)
  const socket = useSocket()

  async function getwindowurl() {
    console.log(window.location.href)
    navigator.clipboard.writeText(window.location.href)
    showToast(" Copied to Clipboard !")
    
  
  }
  const isYouTubeLink= (link) => {
    return link.includes("youtube.com") || link.includes("youtu.be");
  };
  async function deleteIndex(index) {
    setContent(prevContents => prevContents.filter((_, idx) => idx !== index));
  }
  async function deleteLink(index) {
    setlink(prevlinks => prevlinks.filter((_, idx) => idx !== index));
  }
  const addNewIndex = () => {
    setContent(prevContents => [...prevContents, newContent]);
    setNewContent('');
  };
  const addNewLink = async () => {
    const text = await navigator.clipboard.readText();
    console.log(text)
    setNewLink(text)
    setlink(prevContents => [...prevContents, text]);
  };


  async function savenotes(noteid) {
    try {
      const response = await fetch("/api/notesave", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteid: noteid, userid: session?.user?.email

        })
      })
      const data = await response.json()
      console.log("qt data", data)
      if (data.post.Collaborators.includes(session.user.email)) {
        setnoteid(data.post.id)
        settitle(data.post.title)
        setContent(data.post.content)
        setlink(data.post.links)
        setshowcontent(true)
        setloaded(true)
      }
      setloader(false)
    }

    catch (e) {
      alert("Error: " + e)
      window.location.replace("/")
    }
  }
  async function addCollaborator() {
    try {
      const response = await fetch("/api/addcollaborator", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteid: noteid1,
          Collaborator: Collaborators
        })
      })
      const data = await response.json()
      showToast(data.message)
    }
    catch (error) {
      console.log(error)
    }
  }
  async function savedata() {

    await fetch("/api/savedata", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        noteid: noteid1, userid: session.user.email
        , title: title, content: contents, links: links
      })
    })
    console.log("data saved!")

  }





  useEffect(() => { if (firstload) { savedata() } }, [contents.length, links.length])
  useEffect(() => {
    console.log(socket)
    if (socket) {
      socket.on('content update', (newContent) => {
        setContent(newContent);
        console.log("Updating content")
      });
      socket.on('title update', (newTitle) => {
        settitle(newTitle);
        console.log("Updating content")
      });

      return () => {
        socket.off('content update');
      };
    }
  }, [socket]);


  useEffect(
    () => {

      if (status == "authenticated" && !ab.current) {
        ab.current = true
        savenotes(noteid1)


      }
      else if (status == "unauthenticated") {
        sessionStorage.setItem("url", window.location.href)
        window.location.replace("/signin")
      }
      return () => {
        sessionStorage.clear()

      }

    }
    , [status])




  return (
    <div>

      {loader ?
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
        :
        showcontent ?
          <div className="my-6">

            <div className="flex my-4 sm:text-xl text-sm  justify-center gap-4">
              {!addoption ? <button onClick={() => setaddoption(true)} className="my-1 hover:text-black text-white border-white border font-semibold hover:bg-white px-4 rounded-md py-2 block ">{'Add friends !'} </button>
                :
                <div className="sm:flex flex-col  justify-center gap-[5%]">
                  <form >
                    <label for="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative flex justify-between">

                      <input type="search" onChange={(e) => {
                        setCollaborators(e.target.value)

                      }}

                        value={Collaborators}

                        id="search" className="block min-w-80 p-4  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required />
                      <button onClick={addCollaborator} type="button" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
                    </div>
                  </form>
                  <button onClick={() => setaddoption(false)} className="my-1 hover:text-white text-white w-fit border-white border font-semibold hover:bg-red-500 px-2 rounded-md py-1 block mx-auto ">Cancel </button>


                </div>
              }
              {!addoption && <><button onClick={getwindowurl} className="my-1 hover:text-white text-white w-fit border-white border font-semibold hover:bg-red-500 px-2 rounded-md py-1 block ">Copy link to notes ! </button>
                <Link href="/home"> <button className="mt-2 mb-1 hover:text-black text-white border-white border font-semibold hover:bg-white px-4 rounded-md py-2 block ">{'BACK =>'} </button></Link></>}
            </div>


            <div className="flex flex-col  items-center gap-5  justify-center">
              <input value={title} onChange={(e) => {


                const value = e.target.value
                settitle(e.target.value)
                savedata()
                socket?.emit('update title', e.target.value)


              }} className="block font-bold py-1 px-1 bg-black border border-white  sm:text-4xl text-2xl  text-red-500 rounded-lg  focus:border-none text-center min-w-32    h-fit min-h-16 " type="text" ></input>
              {contents.map((content, index) => (
                <div key={index} className="flex justify-center w-[90%]">
                  <textarea key={index} value={content} onChange={(e) => {
                    const value = e.target.value;
                    const updatedContents = [...contents];
                    updatedContents[index] = value;
                    setContent(updatedContents); if (value.length <= 10 || value.includes(" ") || value[value.length - 1] === ' ' || value[value.length - 1] === '.') {
                      savedata()
                      socket?.emit('update title', e.target.value)
                    }

                  }} id="message" className="h-fit p-6 border-8  min-w-[80%] sm:min-h-[80%] w-fit font-semibold  sm:text-2xl text-gray-900 bg-gray-50 rounded-lg  border-blue-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-200" placeholder="Write your thoughts here..."></textarea>
                  <button onClick={() => deleteIndex(index)} className="ml-2 text-red-600 hover:text-red-900 focus:outline-none">
                    <FaTrash />
                  </button>
                </div>))
              }

{links.map((link, index) => (
        <div key={index} className={`flex flex-row w-[90%] items-center justify-center`}>
          {isYouTubeLink(link) ? (
            // Render YouTube player if it's a YouTube video link
            <ReactPlayer url={link} controls={true} />
          ) : (
            // Render regular link if it's not a YouTube video link
            <a
              rel="noreferrer"
              target="_blank"
              href={link}
              className="h-fit p-2 border-1 text-blue-500 font-semibold text-sm sm:text-xl text-wrap text-center bg-gray-50 rounded-lg dark:bg-gray-200"
            >
              {link}
            </a>
          )}
          <button onClick={() => deleteLink(index)} className="ml-2 text-red-600 hover:text-red-900 focus:outline-none">
            <FaTrash />
          </button>
        </div>
      ))}


              <button onClick={addNewIndex} className="my-1 text-center  text-5xl font-bold hover:text-black text-white border-white border  hover:bg-white p-1 rounded-md block mx-auto ">+</button>
              <button onClick={addNewLink} className="my-1 text-center  sm:text-2xl text-lg font-bold hover:text-black text-white border-white border  hover:bg-white p-1 rounded-md block mx-auto ">Paste Link+</button>
            </div>
          </div> : <h1 className="red-500 text-3xl flex justify-center my-[10%] ">
            Access to this note is restricted! Contact the Author !
          </h1>
      }


    </div>

  )
}












