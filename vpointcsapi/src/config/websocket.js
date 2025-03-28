import dotenv from 'dotenv';

dotenv.config();

export const websocketConfig = {
  port: process.env.WS_PORT || 3000,
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
};

export const whatsappConfig = {
  puppeteer: {
    args: ['--no-sandbox']
  }
};