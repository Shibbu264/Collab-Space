import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"]
  }
});

app.use(cors());
let rooms = {};
let space={}
io.on('connection', (socket) => {
  socket.on('update content', ({content,room,index}) => {
    console.log(content);
    socket.broadcast.to(room).emit('content update', {content,index}); // Broadcast to all clients except the sender
  });


  socket.on('joinspace',({room,user})=>{

    if (!space[room]) {
      space[room] = [];
    }
    
    const userExists = space[room].some(u => u.email === user.email);
    if (!userExists) {
 
    socket.join(room)
    space[room].push(user);
    console.log(space[room])
    io.to(room).emit('joinspace',({text:`New user with ${user.email} joined the room !`,users:space[room]}))
    }
  
  })

  socket.on('joinmovieRoom', ({room,user}) => {
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = [];
    }
    const userExists = rooms[room].some(u => u.email === user.email);

    if (!userExists) {
      if(!rooms[room].length){
        user.active=true
      }
      rooms[room].push(user);
      socket.join(room);
       socket.emit('roomUsers', rooms[room]);
       socket.broadcast.to(room).emit('userjoinedroom', rooms[room]);
      console.log(`${user.name} joined room: ${room}`);
    }
    else{
      socket.emit('roomUsers', rooms[room]);
      socket.broadcast.to(room).emit('userjoinedroom', rooms[room]);
      console.log(`${user.name} is already in room: ${room}`);
    }
   
  });

  socket.on('videoState', (data) => {
    socket.broadcast.to(data.room).emit('videoState', data);
  });

  socket.on('changeUrl', (data) => {
    socket.broadcast.to(data.room).emit('changeUrl', data.url);
  });

   socket.on('control access',(data)=>{
    if (!rooms[data.room]) {
      rooms[data.room] = [];
    }
    rooms[data.room] = rooms[data.room].map(u => ({
      ...u,
      active: false
    }));
    const userIndex = rooms[data.room].findIndex(u => u.email === data.user.email);
    if (userIndex !== -1) {
     
      rooms[data.room][userIndex].active = true;
    } else {
     
      rooms[data.room].push({ ...data.user, active: true });
    }
    socket.broadcast.to(data.room).emit('control access',rooms[data.room])
   })

  socket.on('chatMessage',({user,room,message,time})=>{
    socket.join(room);
    socket.broadcast.to(room).emit('chatMessage',({user,message,time}))
  })


  socket.on('disconnect', () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(user => user.socketId !== socket.id);
      socket.broadcast.to(room).emit('roomUsers', rooms[room]);
    }
    console.log('Client disconnected');
  });


  socket.on('update title', ({content,room}) => {
    console.log(content);
    socket.broadcast.to(room).emit('title update', content); // Broadcast to all clients except the sender
  });
});

const PORT = process.env.PORT || 5000;


httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
