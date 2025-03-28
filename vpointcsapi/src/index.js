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
const io = new Server(server);

// Initialize WhatsApp client
const client = new Client();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle client events
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// WhatsApp client event handlers
client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Error generating QR code:', err);
      return;
    }
    io.emit('qr', url);
  });
});

client.on('ready', () => {
  console.log('WhatsApp client is ready!');
  io.emit('ready');
});

client.on('message', (message) => {
  console.log('Message received:', message.body);
  io.emit('message', message);
});

// Initialize WhatsApp client
client.initialize();

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});