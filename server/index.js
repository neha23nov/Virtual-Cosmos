const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// In-memory store of all connected users
const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // New user joins with a username
socket.on('join', ({ username, avatar }) => {
    users[socket.id] = {
      id: socket.id,
      username,
      avatar: avatar || '🧑‍💻',
      x: Math.floor(Math.random() * 600) + 100,
      y: Math.floor(Math.random() * 400) + 100,
      connections: []
    };

    // Send this user their own data
    socket.emit('init', users[socket.id]);

    // Send this user the list of all existing users
    socket.emit('all-users', users);

    // Tell everyone else about the new user
    socket.broadcast.emit('user-joined', users[socket.id]);

    console.log(`${username} joined. Total users: ${Object.keys(users).length}`);
  });

  // User moved — broadcast new position to everyone else
  socket.on('move', ({ x, y }) => {
    if (!users[socket.id]) return;

    users[socket.id].x = x;
    users[socket.id].y = y;

    socket.broadcast.emit('user-moved', {
      id: socket.id,
      x,
      y
    });
  });

  // Chat message — only send to users in the same proximity room
  socket.on('chat-message', ({ toId, message }) => {
    if (!users[socket.id]) return;

    const from = users[socket.id];

    // Send message to the target user
    io.to(toId).emit('receive-message', {
      fromId: socket.id,
      fromName: from.username,
      message,
      timestamp: Date.now()
    });

    // Also echo back to sender so they see their own message
    socket.emit('receive-message', {
      fromId: socket.id,
      fromName: from.username,
      message,
      timestamp: Date.now()
    });
  });

  // User disconnected
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      console.log(`${users[socket.id].username} disconnected`);
      delete users[socket.id];
    }
    io.emit('user-left', socket.id);
  });
});


app.get('/', (req, res) => {
  res.json({ status: 'Virtual Cosmos server running' });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});