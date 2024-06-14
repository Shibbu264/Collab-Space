"use client"
import { useEffect, useRef, useState } from "react"
import { useSession } from 'next-auth/react';
import { Hearts } from "react-loader-spinner";
import { useRouter } from "next/router";
import { useSocket } from "@/context/socket";
import { showToast } from "../../components/toast";
import { FaTrash } from "react-icons/fa"
import ReactPlayer from 'react-player';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Drawer, IconButton, Select, TextField, Tooltip, Avatar } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import WatchParty from "../../components/watchparty";
import Toolbar from "../../components/toolbar"
import { Clear, Close, PlayCircle, ResetTvRounded, ResetTvTwoTone, RestoreFromTrash } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateLastWatchedLink, updateroomid } from "@/redux/slices/videoStreamSlice";

const  Note=({moviedata}) =>{


  const dispatch = useDispatch()
  const { data: session, status } = useSession()
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState('');
  const [title, settitle] = useState("Title")
  const [showcontent, setshowcontent] = useState(false)
  const [contents, setContent] = useState([])
  const [links, setlink] = useState([{ link: "", watchedtill: 0 }])
  const [newContent, setNewContent] = useState('');
  const [newLink, setNewLink] = useState('');
  const [loader, setloader] = useState(true)
  const router = useRouter()
  const noteid1 = router.query.space
  const [groupwatchsession, setgroupsession] = useState(false)
  const [Noteidaftersaving, setnoteid] = useState("")
  const [users,setcurrentusers]=useState([])
  const intervalRef = useRef(null)
  const [addoption, setaddoption] = useState(false)
  const ab = useRef(false)
  const [Collaborators, setCollaborators] = useState('');
  const [firstload, setloaded] = useState(false)
  const socket = useSocket()
  const [dailyquestion, setdailyquestion] = useState("")
  const playerRefs = useRef([]);
  const [draweropen,setdraweropen]=useState(false)
  const movieurl = useSelector((state)=>state.videoStream.lastwatchedlink);

  

useEffect(()=>{dispatch(updateroomid(router.query.space))},[noteid1])



  async function getwindowurl() {
    console.log(window.location.href)
    navigator.clipboard.writeText(window.location.href)
    showToast(" Copied to Clipboard !")
  }

  const toggleImportance = (index, type) => {
    if (type === 'content') {
      const updatedContents = [...contents];
      updatedContents[index].important = !updatedContents[index].important;
      console.log(updatedContents[index].important)
      setContent(updatedContents);
    } else if (type === 'link') {
      const updatedLinks = [...links];
      updatedLinks[index].important = !updatedLinks[index].important;
      updatedLinks[index].important
      setlink(updatedLinks);
    }
  };


  const isYouTubeLink = (link, index) => {
    return link.url.includes("youtube.com") || link.url.includes("youtu.be");
  };

  async function deleteIndex(index) {
    setContent(prevContents => prevContents.filter((_, idx) => idx !== index));
  }

  async function deleteLink(index) {
    setlink(prevlinks => prevlinks.filter((_, idx) => idx !== index));
    setOpen(false)
  }

  const addNewIndex = () => {
    setContent(prevContents => [...prevContents, newContent]);
    setNewContent('');
  };
  const addNewLink = async () => {
    const text = await navigator.clipboard.readText();
    console.log(text)
    setNewLink(text)
    setlink(prevContents => [...prevContents, { url: text, watchedtill: 0 }]);
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
      if (data.post.Collaborators.includes(session.user.email)) {
        setnoteid(data.post.id)
        settitle(data.post.title)
        setContent(data.post.content)
        setlink(data.post.links)
        setshowcontent(true)
        setloaded(true)
        socket.emit('joinspace',{room:noteid1,user:session.user})
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

      const response2 = await fetch("/api/sendmail", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: Collaborators,
          url: "https://thought-box-2fkg.vercel.app/newnotes/" + noteid1
        })
      })


      showToast("Succesfully sent collaboration request on mail !")
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleProgress = (progress, index) => {

    const lastPlayedSeconds = progress.playedSeconds;
    const updatedLinks = [...links];
    updatedLinks[index].watchedtill = lastPlayedSeconds;
    setlink(updatedLinks);
    console.log(links[index].url)

  };

  async function savedata() {

    await fetch("/api/savedata", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        noteid: noteid1, userid: session?.user.email
        , title: title, content: contents, links: links
      })
    })
    console.log("data saved!")

  }

  useEffect(() => {
   
    intervalRef.current = setInterval(savedata, 30000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);


  const fetchDailyCodingChallenge = async () => {
    console.log(`Fetching daily coding challenge from LeetCode API.`)

    try {
      const response = await fetch("https://alfa-leetcode-api.onrender.com/daily")
      const data = await response.json()
      setdailyquestion(data.questionLink)
    }
    catch (e) { console.log(e) }
  }

  useEffect(() => {
    fetchDailyCodingChallenge()

  }, [])



  useEffect(() => { if (firstload) { savedata() } }, [contents.length, links])
  useEffect(() => {

    if (socket) {
      socket.on('content update', ({content,index}) => {
        setContent((prevContents) => {
         
          const newContents = [...prevContents];
         
          newContents[index] = content;
         
          return newContents;
      });
        console.log("Updating content")
      });
      socket.on('title update', (newTitle) => {
        settitle(newTitle);
        console.log("Updating content")
      });
      socket.on('joinspace',({text,users})=>{
        console.log(text,users)
        setcurrentusers(users)
      })

      return () => {
        socket.off('content update');
        socket.off('title update');
        socket.off('joinspace');
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
          (!groupwatchsession ?
            <div className="my-6 max-sm:px-6 max-sm:flex max-sm:w-[100%] max-sm:justify-center">


              <Toolbar addCollaborator={addCollaborator} setgroupsession={setgroupsession} groupwatchsession={groupwatchsession} setCollaborators={setCollaborators} addoption={addoption} setaddoption={setaddoption} Collaborators={Collaborators} getwindowurl={getwindowurl} />
             <div className="flex gap-2 justify-center mb-2">
              {users && users.map((user, index) => (
          <Tooltip key={index} title={user.name}>
            <Avatar src={user.image} alt={user.name}  onClick={() => handleAvatarClick(user)}
            style={{ border:  '2px solid transparent' }} />
          </Tooltip>
        ))}
</div>

              <div className="flex flex-col  items-center gap-6 sm:gap-5  justify-center">
                {editing ? <div className="flex  gap-6"> <input value={title} onChange={(e) => {
                  settitle(e.target.value)
                  socket?.emit('update title', {content:e.target.value,room:noteid1})

                }} className="block    h-fit  overflow-hidden font-bold  py-3 px-1 bg-black border border-white  sm:text-4xl text-2xl  text-red-500 rounded-lg  focus:border-none text-center min-w-32 " type="text" ></input>
                  <Button onClick={() => { setEditing(false); savedata() }} variant="contained" color="primary">
                    Save
                  </Button>
                </div>

                  :
                  <h1 onClick={() => { setEditing(true) }} className="block    h-fit  overflow-hidden font-bold  py-3 px-6 bg-black border border-white  sm:text-4xl text-2xl  text-red-500 rounded-lg  focus:border-none text-center min-w-32 " type="text" >{title}</h1>}

                {(session.user.email).includes("shivanshu") ? <> <a
                  rel="noreferrer"
                  target="_blank"
                  href={dailyquestion}
                  className="h-fit p-2 border border-blue-50 bg-black text-yellow-500  font-semibold text-sm sm:text-xl text-wrap text-center  rounded-lg "
                >
                  {dailyquestion}
                </a>
                </>


                  : <></>}

                <Dialog open={open} onClose={() => setOpen(false)}>
                  <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>Confirm Delete</DialogTitle>
                  <DialogContent>
                    <p className='text-xl font-semibold'>Are you sure you want to delete this note?</p>
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained"
                      color="info" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained"
                      color="error"
                      onClick={() => { deleteLink(noteIdToDelete) }} autoFocus>
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>



                {contents?.map((content, index) => (
                  <div key={index} className="flex justify-center w-[90%]">
                    <TextareaAutosize minRows={2} key={index} value={content} onChange={(e) => {
                      const value = e.target.value;
                      const updatedContents = [...contents];
                      updatedContents[index] = value;
                      setContent(updatedContents); 
                      if (value.length >= 10 || value.includes(" ") || value[value.length - 1] === ' ' || value[value.length - 1] === '.') {
                        savedata()}


                        socket?.emit('update content', {content:e.target.value,room:noteid1,index})
                      

                    }} id="message" className="py-1 rounded-3xl px-6 border-8  min-w-[80%] w-fit font-semibold  sm:text-2xl text-gray-900 bg-gray-50  border-blue-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-200" placeholder="Write your thoughts here..."></TextareaAutosize >
                    <button onClick={() => deleteIndex(index)} className="ml-2 text-red-600 hover:text-red-900 focus:outline-none">
                      <FaTrash />
                    </button>

                  </div>))
                }

                {links?.map((link, index) => (
                  <div key={index} className={`flex flex-row w-[80%] sm:w-[90%] items-center justify-center`}>
                    {isYouTubeLink(link, index) ? (

                      <ReactPlayer url={link.url} ref={(player) => (playerRefs.current[index] = player)} onEnded={() => { console.log("VideoEnded Bc!") }} controls={true} startTime={link.watchedtill} onProgress={(progress) => handleProgress(progress, index)} />
                    ) : (

                      <a
                        rel="noreferrer"
                        target="_blank"
                        href={link.url}
                        className="h-fit p-2 max-sm:w-fit border-1 text-blue-500 font-semibold text-sm sm:text-xl sm:text-wrap text-center bg-gray-50 rounded-lg dark:bg-gray-200"
                      >
                        {link.url}
                      </a>
                    )}
                    <div className="gap-6 hidden sm:flex">
                      <button onClick={() => { if (link.important) { setOpen(true); setNoteIdToDelete(index) } else { deleteLink(index) } }} className="ml-2 text-red-600 hover:text-red-900 focus:outline-none">
                        <FaTrash />
                      </button>
                      <Button variant={link.important ? `contained` : `outlined`} onClick={() => toggleImportance(index, 'link')} className={`ml-2 ${link.important ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-900 focus:outline-none`}>
                        {link.important ? 'Marked as Important' : 'Mark as Important'}
                      </Button >
                    </div>
                  </div>
                ))}


                <button onClick={addNewIndex} className="my-1 text-center  text-5xl font-bold hover:text-black text-white border-white border  hover:bg-white p-1 rounded-md block mx-auto ">+</button>
                <button onClick={addNewLink} className="my-1 text-center  sm:text-2xl text-lg font-bold hover:text-black text-white border-white border  hover:bg-white p-1 rounded-md block mx-auto ">Paste Link+</button>
              </div>
            </div> :
            <div className="flex flex-col items-center">
              <Toolbar draweropen={draweropen} setdraweropen={setdraweropen} addCollaborator={addCollaborator} setgroupsession={setgroupsession} groupwatchsession={groupwatchsession} setCollaborators={setCollaborators} addoption={addoption} setaddoption={setaddoption} Collaborators={Collaborators} getwindowurl={getwindowurl} />
              <WatchParty  />
              <Drawer anchor="right" open={draweropen}>
                <IconButton color="error" onClick={()=>{setdraweropen(false)}}>
                  <Close/>
                </IconButton>
              <div  className={`flex flex-col px-10 py-4 w-[90%]  items-center justify-center`}>

              <div className="flex justify-center w-[90%]">
          <TextField
            sx={{
              minWidth:"80%"
            }}
            type="search"
            onChange={(e) => dispatch(updateLastWatchedLink(e.target.value))}
            value={movieurl}
            id="search"
           
            placeholder="Paste video link "
         
          />
          <IconButton onClick={()=>{dispatch(updateLastWatchedLink(""))}} color="primary">
            <Clear/>
          </IconButton>
          </div>
          <h3>Paste Video Link here !</h3>

          <div  className={`flex flex-col px-10 py-5 w-[90%] gap-y-12 items-center justify-center`}>
                {links?.map((link, index) => (
                 <>
                    {isYouTubeLink(link, index) ? (
                      <div className="flex flex-2">
                        <ReactPlayer controls={false}  key={index} width={360} height={240} url={link.url} paused={true} />
                        <IconButton onClick={()=>{dispatch(updateLastWatchedLink(link.url))}} color={link.url==movieurl?"error":"info"}>
                          <PlayCircle/>
                        </IconButton>
                      </div>
                    ) : null}
                  </>
              
                ))}
                </div>
                </div>

              </Drawer>
            </div>
          ) : <h1 className="red-500 text-3xl flex justify-center my-[10%] ">
            Access to this note is restricted! Contact the Author !
          </h1>
      }


    </div>

  )

  
  
}

export default Note;











