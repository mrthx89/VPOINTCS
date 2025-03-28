import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import { whatsappConfig } from '../config/websocket.js';

class WhatsAppService {
  constructor(io) {
    this.io = io;
    this.client = new Client(whatsappConfig);
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.client.on('qr', this.handleQR.bind(this));
    this.client.on('ready', this.handleReady.bind(this));
    this.client.on('message', this.handleMessage.bind(this));
    this.client.on('disconnected', this.handleDisconnected.bind(this));
  }

  async handleQR(qr) {
    try {
      const qrUrl = await qrcode.toDataURL(qr);
      this.io.emit('whatsapp-qr', { qr: qrUrl });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  handleReady() {
    console.log('WhatsApp client is ready!');
    this.io.emit('whatsapp-ready');
  }

  handleMessage(message) {
    this.io.emit('whatsapp-message', {
      from: message.from,
      body: message.body,
      timestamp: message.timestamp
    });
  }

  handleDisconnected(reason) {
    console.log('WhatsApp client was disconnected:', reason);
    this.io.emit('whatsapp-disconnected', { reason });
  }

  async sendMessage(to, message) {
    try {
      await this.client.sendMessage(to, message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  initialize() {
    this.client.initialize();
  }
}

export default WhatsAppService;