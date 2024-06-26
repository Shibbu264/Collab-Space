import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/socket';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import ChatBox from './Chatbox'
import { Avatar, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateLastWatchedLink, updateactive } from '@/redux/slices/videoStreamSlice';

const WatchParty = () => {
  const session=useSession()  
  const socket = useSocket();
  const dispatch=useDispatch()
  const router=useRouter()
  const room=router.query.space
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [users, setUsers] = useState([]);
const [first,setcheck]=useState(false)
const [control,setcontrol]=useState(false)
 const movieurl = useSelector((state)=>{return state.videoStream.lastwatchedlink});
 const playbackRate=useSelector((state)=>state.videoStream.lastwatchedspeed)


useEffect(()=>{ dispatch(updateactive(control))},[control])



  useEffect((
  )=>{
    if(session.status=="authenticated"){
        const user = {
            email: session.data.user.email,
            name: session.data.user.name,
            image: session.data.user.image,
            socketId: socket.id,
            active: false
          };
        
          socket?.emit('joinmovieRoom', { room, user });
    }

  },[session.status])
  



  useEffect(() => {
    if (!socket  ) return;
   
    socket.on('roomUsers', (users) => {
      
      setUsers(users);
      const user=users.filter(user=>user.email==session.data.user.email)
      console.log(user)
      if(user[0].active){setcontrol(true)}
      else{
        setcontrol(false)
      }
    });

    return () => {
      socket.off('roomUsers');
      socket.emit('leaveRoom', { room, user:session.data.user });
    };
  }, [socket, room]);

useEffect(()=>{
    if(control){
    socket.emit('changeUrl', {room,url:movieurl})
    }

},[movieurl])



  useEffect(() => {
    if (!socket  ) return;

   


    socket.on('changeUrl', (url) => {
      dispatch(updateLastWatchedLink(url));
    });

    socket.on('videoState', (data) => {
      if (data.type === 'play') {
        setPlaying(true);
      } else if (data.type === 'pause') {
        setPlaying(false);
      } else if (data.type === 'seek') {
       
      playerRef.current.seekTo(data.time);
    
      }
    });
   
    socket.on('control access',(users)=>{
      setUsers(users)
      const user=users.filter(user=>user.email==session.data.user.email)
      if(user[0].active){setcontrol(true)
      }
      else{
        setcontrol(false)
      }
    })



    setcheck(true)

    return () => {
      socket.off('videoState');
      socket.off('changeUrl');
      socket.off('control access')
    };
  }, [socket,movieurl]);



  const handleAvatarClick = (user1) => {
    setUsers(users.map(user => 
      user.email === user1.email ? { ...user, active: true } : { ...user, active: false }
    )); 
    socket.emit('control access',{room,user:user1})
  };


  const handlePlay = () => {
    const user=users.filter(user=>user.email==session.data.user.email)
    if(user[0].active){
    setPlaying(true);
    socket.emit('videoState', { room, type: 'play' });
    }
  };

  const handlePause = () => {
    const user=users.filter(user=>user.email===session.data.user.email)
    console.log(user)
    console.log(user[0].active)
    if(user[0].active){
    setPlaying(false);
    socket.emit('videoState', { room, type: 'pause' });
    }
  };
  const handleSeek = (time) => {
    const user=users.filter(user=>user.email==session.data.user.email)
    if(user[0].active){
    console.log("seeked",time)
    }
  };

  const handleProgress = (state) => {
    const user=users.filter(user=>user.email==session.data.user.email)
    if(user[0].active){
    const time = state.playedSeconds;
    socket.emit('videoState', { room, type: 'seek', time });
    }
  };

  return (
    <div className=''>
        <div className='block mb-4 mx-auto'>
          <div className="flex  space-x-4">
        {users.map((user, index) => (
          <Tooltip key={index} title={user.name}>
            <Avatar  src={user.image} alt={user.name}  onClick={() => handleAvatarClick(user)}
            style={{ border: user.active ? '4px solid green' : '2px solid transparent' }} />
          </Tooltip>
        ))}
      </div>
      </div>
      <div className='flex sm:flex-1 flex-row mb-[5%]'>
    <div className='sm:w-[90%] w-[95%] sm:min-w-[1020px] h-[440px] sm:h-[580px]'>
    {first &&  <ReactPlayer
        width={"100%"}
        controls={true}
        config={{
          youtube:{
            controls:control
          }
        }}
        height={"100%"}
        ref={playerRef}
        url={movieurl}
        playing={playing}
        playbackRate={playbackRate}
        onSeek={handleSeek}
        onPlay={handlePlay}
        onPause={handlePause}
        onProgress={handleProgress}

       
      />}
    </div>

    <ChatBox/>

    </div>
    </div>
  );
}

export default WatchParty;
