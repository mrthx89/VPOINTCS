'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, List, ListItem } from '@mui/material';
import { useWebSocket } from '../hooks/useWebSocket';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { socket, isConnected, error, sendMessage } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, data]);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };
    }
  }, [socket]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, height: 'calc(100vh - 100px)' }}>
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">Live Chat</Typography>
          {!isConnected && (
            <Typography variant="caption" color="error.light">
              Disconnected from server
            </Typography>
          )}
        </Box>

        <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.map((message) => (
            <ListItem key={message.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="caption" color="text.secondary">
                {message.sender} - {new Date(message.timestamp).toLocaleTimeString()}
              </Typography>
              <Paper elevation={1} sx={{ p: 1, mt: 1, backgroundColor: 'background.paper' }}>
                <Typography>{message.text}</Typography>
              </Paper>
            </ListItem>
          ))}
        </List>

        <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              disabled={!isConnected}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!isConnected || !newMessage.trim()}
            >
              Send
            </Button>
          </Box>
          {error && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}