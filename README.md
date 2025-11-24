# TinyLink - URL Shortener

TinyLink is a full-stack URL shortener application that allows users to shorten URLs, create custom aliases, generate QR codes, and view basic analytics.

## Features
- Shorten long URLs
- Custom short codes
- QR code generation (PNG)
- Analytics: total clicks and last clicked time
- Copy and delete link options
- Responsive frontend UI
- Backend built with Express.js
- PostgreSQL database (Neon DB)

## Tech Stack
Frontend: React.js, Vite, CSS  
Backend: Node.js, Express.js  
Database: PostgreSQL  
Utilities: qrcode, pg  
Deployment: Vercel

## Project Structure
TinyLink/
├── backend/
│   ├── config/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── StatsPage.jsx
│   │   ├── apiService.js
│   │   └── index.css
│   └── vite.config.js
└── vercel.json

## Installation

### Clone Repository
git clone https://github.com/YOUR_USERNAME/tinylink-assignment.git  
cd tinylink-assignment

### Backend Setup
cd backend  
npm install

Create a .env file:
DATABASE_URL=postgres://user:password@host:port/database
BASE_URL=http://localhost:5000
PORT=5000

Create database table:
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(8) UNIQUE NOT NULL CHECK (short_code ~ '^[A-Za-z0-9]{6,8}$'),
    target_url TEXT NOT NULL,
    total_clicks INTEGER NOT NULL DEFAULT 0,
    last_clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

### Frontend Setup
cd ../frontend  
npm install

## Running Locally

### Backend
cd backend  
npm run dev  
# Runs on http://localhost:5000

### Frontend
cd frontend  
npm run dev  
# Runs on http://localhost:5173

## API Endpoints
GET /healthz  
GET /api/links  
POST /api/links  
GET /api/links/:code  
DELETE /api/links/:code  
GET /api/qr?url=...  
GET /:code  

## Deployment (Vercel)
1. Push repo to GitHub
2. Import into Vercel
3. Select Vite as framework
4. Add DATABASE_URL environment variable
5. Deploy