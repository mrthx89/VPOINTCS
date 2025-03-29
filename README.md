# VPointCS

Aplikasi Customer Service berbasis WhatsApp untuk mengelola pesan masuk dengan multiple CS.

## Struktur Proyek

- `vpointcs.app/` - Frontend Next.js + Tailwind CSS + Material UI
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

### Frontend (vpointcs.app)
- Next.js
- Tailwind CSS
- WebSocket client
- Material UI
- Axios
- React Toastify
- React Icons
- React Hot Toast
- React Hotkeys
- React Hotkeys Hook

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
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

### Backend (.env)
```
PORT=4000
DB_SERVER=localhost
DB_NAME=VPointCS
DB_USER=sa
DB_PASSWORD=your_password
WS_PORT=5000
```