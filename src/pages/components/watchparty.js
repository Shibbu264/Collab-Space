import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/socket';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Avatar, Tooltip } from '@mui/material';

const WatchParty = ({movieurl,setmovieurl}) => {
  const [selectedUser, setSelectedUser] = useState('');
  const session=useSession()  
  const socket = useSocket();
  const router=useRouter()
  const room=router.query.noteid
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [users, setUsers] = useState([]);
 const [seek,setseek]=useState(false)
const [first,setcheck]=useState(false)
const [control,setcontrol]=useState(true)
  useEffect((
  )=>{
    if(session.status=="authenticated"){
        const user = {
            email: session.data.user.email,
            name: session.data.user.name,
            image: session.data.user.image,
            socketId: socket.id,
            active: session.data.user.email==selectedUser
          };
         setSelectedUser(session.data.user.email)
          socket?.emit('joinRoom', { room, user });
    }

  },[session.status])
  



  useEffect(() => {
    if (!socket  ) return;
    console.log("inside")
    socket.on('roomUsers', (users) => {
      setUsers(users);
      const user=users.filter(user=>user.email==session.data.user.email)
      if(user[0].active){setcontrol(true)}
      else{
        setcontrol(false)
      }
    });

    return () => {
      socket.off('roomUsers');
    };
  }, [socket, room]);

useEffect(()=>{
    console.log(movieurl)
    socket.emit('changeUrl', {room,url:movieurl})

},[movieurl])



  useEffect(() => {
    if (!socket  ) return;

   


    socket.on('changeUrl', (url) => {
      setmovieurl(url);
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
      if(user[0].active){setcontrol(true)}
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
    console.log(user.active)
    if(user[0].active){
    setPlaying(false);
    socket.emit('videoState', { room, type: 'pause' });
    }
  };
  const handleSeek = (time) => {
    const user=users.filter(user=>user.email==session.data.user.email)
    if(user[0].active){
    console.log("seeked",time)
  setseek(true)
    }
  };

  const handleProgress = (state) => {
    const user=users.filter(user=>user.email==session.data.user.email)
    if(user[0].active){
    const time = state.playedSeconds;
    socket.emit('videoState', { room, type: 'seek', time });
    setseek(false)
    }
  };

  return (
    <div className=''>
        <div className='block mb-4 mx-auto'>
          <div className="flex mt-4 space-x-4">
        {users.map((user, index) => (
          <Tooltip key={index} title={user.name}>
            <Avatar  src={user.image} alt={user.name}  onClick={() => handleAvatarClick(user)}
            style={{ border: user.active ? '4px solid green' : '2px solid transparent' }} />
          </Tooltip>
        ))}
      </div>
      </div>
    <div className='sm:w-[90%] w-[95%] sm:min-w-[1020px] h-[440px] sm:h-[580px]'>

    {first &&  <ReactPlayer
        width={"100%"}
        controls={control}
        height={"100%"}
        ref={playerRef}
        url={movieurl}
        playing={playing}
        onSeek={handleSeek}
        onPlay={handlePlay}
        onPause={handlePause}
        onProgress={handleProgress}
       
      />}
    </div>
    </div>
  );
}
export default WatchParty;
