import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'development' 
      ? ['http://localhost:3000', 'http://localhost:5173'] 
      : 'YOUR_PRODUCTION_URL',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// CORS configuration for Express
const corsOptions = {
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5173']
    : 'YOUR_PRODUCTION_URL',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Store active users and rooms
const users = new Map();
const rooms = new Set(['general', 'random', 'help']);

// In-memory store for messages (will be synced with file system)
const messagesFilePath = path.resolve(__dirname, 'messages.json');
let messages = [];

// Function to load messages from file
const loadMessages = async () => {
  try {
    const data = await fs.readFile(messagesFilePath, 'utf8');
    messages = JSON.parse(data);
    console.log(`Loaded ${messages.length} messages from ${messagesFilePath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('messages.json not found, starting with empty messages.');
      messages = [];
    } else {
      console.error('Failed to load messages:', error);
    }
  }
};

// Function to save messages to file
const saveMessages = async () => {
  try {
    await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
    console.log('Messages saved to messages.json');
  } catch (error) {
    console.error('Failed to save messages:', error);
  }
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle new user
  socket.on('join', ({ username, room }) => {
    // Leave any existing rooms
    if (socket.room) {
      socket.leave(socket.room);
    }

    // Join new room
    socket.join(room);
    socket.room = room;
    socket.username = username;
    
    // Update users map
    users.set(socket.id, { username, room });

    // Send past messages to the newly joined user
    const roomMessages = messages.filter(msg => msg.room === room);
    socket.emit('chatHistory', roomMessages);
    
    // Notify room about new user
    socket.to(room).emit('message', {
      user: 'System',
      text: `${username} has joined the room`,
      timestamp: new Date()
    });

    // Send room info
    io.to(room).emit('roomData', {
      room,
      users: Array.from(users.values()).filter(user => user.room === room)
    });
  });

  // Handle new message
  socket.on('sendMessage', async (message) => {
    const user = users.get(socket.id);
    if (user) {
      const msg = {
        user: user.username,
        text: message.text,
        timestamp: new Date().toISOString(), // Ensure ISO string for consistent parsing
        room: user.room
      };
      messages.push(msg); // Add message to in-memory store
      await saveMessages(); // Persist messages to file
      io.to(user.room).emit('message', msg);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const { username, room } = user;
      users.delete(socket.id);
      
      socket.to(room).emit('message', {
        user: 'System',
        text: `${username} has left the room`,
        timestamp: new Date()
      });

      io.to(room).emit('roomData', {
        room,
        users: Array.from(users.values()).filter(u => u.room === room)
      });
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Gemini AI Smart Reply Endpoint
app.post('/api/smart-reply', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Generate a natural-sounding reply to this chat message: "${message}"`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m not sure how to respond to that.';
    
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate smart reply',
      details: error.message 
    });
  }
});

// Get all rooms
app.get('/api/rooms', (req, res) => {
  res.json({ rooms: Array.from(rooms) });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3002; // Changed from 3001 to 3002
const serverInstance = server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  await loadMessages(); // Load messages when server starts
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  serverInstance.close(() => process.exit(1));
});

export { server, io, serverInstance };
