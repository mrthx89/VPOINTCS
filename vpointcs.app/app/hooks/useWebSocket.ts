'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketHook {
  socket: WebSocket | null;
  isConnected: boolean;
  error: string | null;
  sendMessage: (message: string) => void;
}

export const useWebSocket = (url: string = `${process.env.NEXT_PUBLIC_WS_URL}`): WebSocketHook => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<number>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        if (!event.wasClean) {
          setError('Koneksi WebSocket terputus');
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current += 1;
              connect();
            }, reconnectDelay);
          } else {
            setError('Gagal terhubung ke server setelah beberapa percobaan');
          }
        }
      };

      ws.onerror = (event) => {
        setError('Terjadi kesalahan pada koneksi WebSocket');
        console.error('WebSocket error:', event);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          return data;
        } catch (err) {
          console.error('Error parsing message:', err);
          setError('Error memproses pesan dari server');
        }
      };

      setSocket(ws);

      return ws;
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Gagal membuat koneksi WebSocket');
      return null;
    }
  }, [url]);

  useEffect(() => {
    const ws = connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socket && isConnected) {
        try {
          socket.send(JSON.stringify(message));
        } catch (err) {
          console.error('Error sending message:', err);
          setError('Failed to send message');
        }
      } else {
        setError('WebSocket is not connected');
      }
    },
    [socket, isConnected]
  );

  return { socket, isConnected, error, sendMessage };
};