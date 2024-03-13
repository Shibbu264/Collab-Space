import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from "cors"
const app = express();
app.use(cors())
const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {
  origin: "https://thought-box-2fkg.vercel.app", 
  methods: ["GET", "POST"] 
}});

io.on('connection', (socket) => {
  socket.on('update content', (content) => {
    console.log(content);
    io.emit('content update', content);
  });
  socket.on('update title', (content) => {
    console.log(content);
    io.emit('title update', content);
  });
});

app.get('/socket', (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } 
  else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server,{cors: {
      origin: "https://thought-box-2fkg.vercel.app", 
      methods: ["GET", "POST"] 
    }});
    res.socket.server.io = io;
    io.on('connection', (socket) => {
      socket.on('update content', (content) => {
        console.log(content);
        io.emit('content update', content);
      });
    });
  }
  res.end();
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
