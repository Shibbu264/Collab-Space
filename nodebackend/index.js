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

io.on('connection', (socket) => {
  socket.on('update content', (content) => {
    console.log(content);
    socket.broadcast.emit('content update', content); // Broadcast to all clients except the sender
  });

  socket.on('update title', (content) => {
    console.log(content);
    socket.broadcast.emit('title update', content); // Broadcast to all clients except the sender
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
