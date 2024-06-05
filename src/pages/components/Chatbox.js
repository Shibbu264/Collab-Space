import React, { useEffect, useState } from "react";
import { styled } from '@mui/system';
import { IconButton, Paper, TextField } from '@mui/material';
import { MessageLeft, MessageRight } from "./message";
import { useSocket } from "../../context/socket";
import { useSession } from 'next-auth/react';
import { Send } from "@mui/icons-material";
import { useRouter } from "next/router";

const Container = styled('div')({
  width: "fit",
  height: "fit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const InputContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px',
    borderTop: '1px solid #ccc',
  });
const StyledPaper = styled(Paper)({
  width: "80vw",
  height: "80vh",
  maxWidth: "400px",
  maxHeight: "650px",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "relative",
});

const MessagesBody = styled(Paper)({
  width: "calc( 100% - 20px )",
  margin: 10,
  overflowY: "scroll",
  height: "calc( 100% - 80px )",
});

export default function Chatbox() {
  const session = useSession();
  const socket = useSocket();
  const router=useRouter()
  const [message, setMessage] = useState('');
  const [messages,setMessages]=useState(JSON.parse(localStorage.getItem("message")) || [])
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  const handleSendMessage = () => {
    setMessages(prevMessages => [...prevMessages, { user:session.data.user, message:message,time:Date.now() }]);
    console.log(messages)
    socket.emit('chatMessage',({user:session.data.user,message:message,room:router.query.space,time:Date.now()}))
    console.log("Sending message:", message);
    setMessage('');
  };

  useEffect(()=>{
localStorage.setItem("message",JSON.stringify(messages))
  },[messages])


  useEffect(()=>{
if(!socket){return;}
   
    socket.on('chatMessage',({user,message,time})=>{
        console.log(message)
        setMessages(prevMessages => [...prevMessages, { user, message,time }]);
    })
    console.log(messages)

   return ()=>{
    socket.off('chatMessage');
   } 
  },[socket])

  return (
    
    <Container>
      <StyledPaper>
        <MessagesBody id="style-1">
            {messages?.map((message,index)=>(
              session?.data.user.email===message.user.email?
              <MessageRight
              key={index}
              message={message.message}
              timestamp={formatTime(message.time)}
              photoURL={message.user.image}
              displayName={message.user.name.slice(0,15)}
              avatarDisp={true}
              />:<MessageLeft key={index} message={message.message}
              timestamp={formatTime(message.time)}
              photoURL={message.user.image}
              displayName={message.user.name.slice(0,16)}
              avatarDisp={false}/>
            ))}


         
        </MessagesBody>
      
        <InputContainer>
          <TextField
            value={message}
            onChange={handleMessageChange}
            variant="outlined"
            label="Type a message..."
            fullWidth
          />
          <IconButton onClick={handleSendMessage} color="primary">
            <Send />
          </IconButton>
        </InputContainer>




      </StyledPaper>
    </Container>
  );
}
