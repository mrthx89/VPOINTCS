import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import { authenticate } from './middleware/auth.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.use('/auth', authRouter);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Initialize WhatsApp client
const client = new Client({
  puppeteer: {
    args: ['--no-sandbox']
  }
});

// WhatsApp Events
client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Error generating QR code:', err);
      return;
    }
    io.emit('whatsapp-qr', { qr: url });
  });
});

client.on('ready', () => {
  console.log('WhatsApp client is ready!');
  io.emit('whatsapp-ready');
});

client.on('message', async (message) => {
  io.emit('whatsapp-message', {
    from: message.from,
    body: message.body,
    timestamp: message.timestamp
  });
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('send-message', async (data) => {
    try {
      const { to, message } = data;
      await client.sendMessage(to, message);
      io.emit('message-sent', { to, message });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message-error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize WhatsApp client
client.initialize();

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});