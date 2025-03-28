# VPointCS

Aplikasi Customer Service berbasis WhatsApp untuk mengelola pesan masuk dengan multiple CS.

## Struktur Proyek

- `vpointcsapp/` - Frontend Vue.js + Tailwind CSS
- `vpointcsapi/` - Backend Express.js + WhatsApp Web.js

## Fitur Utama

- Autentikasi pengguna (CS)
- Manajemen CS
- Scan QR WhatsApp
- Pengelolaan pesan masuk/keluar
- Dashboard monitoring
- Integrasi dengan SQL Server
- Realtime komunikasi menggunakan WebSocket

## Teknologi

### Frontend (vpointcsapp)
- Vue.js
- Tailwind CSS
- WebSocket client

### Backend (vpointcsapi)
- Express.js
- WhatsApp Web.js
- SQL Server
- WebSocket server

## Struktur Database

### Tabel Customer
- CustomerID (Primary Key)
- WhatsAppNumber
- Name
- CreatedAt
- UpdatedAt

### Tabel User (CS)
- UserID (Primary Key)
- Username
- Password (Hashed)
- Name
- Role
- CreatedAt
- UpdatedAt

### Tabel IncomingMessage
- MessageID (Primary Key)
- CustomerID (Foreign Key)
- WhatsAppMessageID
- Content
- MediaURL
- ReceivedAt
- Status

### Tabel OutgoingMessage
- MessageID (Primary Key)
- CustomerID (Foreign Key)
- UserID (Foreign Key)
- WhatsAppMessageID
- Content
- MediaURL
- SentAt
- Status

## Konfigurasi

Semua konfigurasi sensitif disimpan dalam file .env di masing-masing folder:

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Backend (.env)
```
PORT=3000
DB_SERVER=local
DB_NAME=VPointCS
DB_USER=sa
DB_PASSWORD=Sg1
WS_PORT=3000
```