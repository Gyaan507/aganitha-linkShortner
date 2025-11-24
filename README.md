TinyLink - Full Stack URL ShortenerTinyLink is a modern, full-stack URL shortening application designed to mimic the core functionality and aesthetic of platforms like Bitly. It allows users to shorten long URLs, generate QR codes, and track click analytics in real-time.🚀 FeaturesURL Shortening: Convert long URLs into short, manageable links.Custom Short Codes: Users can define their own custom aliases (e.g., /google12).QR Code Generation: Instantly generate downloadable QR codes for any URL.Real-time Analytics: Track total clicks and the "last clicked" timestamp for every link.Link Management: View a dashboard of all links with options to copy or delete them.High-Contrast UI: A professional, clean interface inspired by Bitly.Responsive Design: Fully functional on mobile and desktop devices.🛠️ Tech StackFrontend:React.js (Vite)React Router (SPA Routing)Plain CSS (Custom High-Contrast Theme)Backend:Node.js & Express.jsPostgreSQL (Neon Database)qrcode library for image generationDeployment:Vercel (Frontend & Backend via Serverless Functions)📂 Project StructureThis project is structured as a Monorepo:TinyLink/
├── backend/                # Express Server & API Logic
│   ├── config/             # Database connection
│   ├── routes/             # API endpoints (links, redirect, qr)
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
├── frontend/               # React Application
│   ├── src/
│   │   ├── App.jsx         # Main Dashboard & Router
│   │   ├── StatsPage.jsx   # Analytics View
│   │   └── apiService.js   # API Fetch Wrapper
│   └── ...
├── vercel.json             # Deployment configuration
└── README.md
⚙️ Installation & SetupPrerequisitesNode.js (v16 or higher)PostgreSQL Database (Local or Cloud like Neon/Supabase)1. Clone the Repositorygit clone [https://github.com/YOUR_USERNAME/tinylink-assignment.git](https://github.com/YOUR_USERNAME/tinylink-assignment.git)
cd tinylink-assignment
2. Backend SetupNavigate to the backend folder and install dependencies:cd backend
npm install
Environment Variables:Create a .env file in the backend/ directory:# Your PostgreSQL connection string
DATABASE_URL=postgres://user:password@host:port/database

# Base URL for the application (Localhost for dev)
BASE_URL=http://localhost:5000
PORT=5000
Database Schema:Run the following SQL command in your database to create the required table:CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(8) UNIQUE NOT NULL CHECK (short_code ~ '^[A-Za-z0-9]{6,8}$'),
    target_url TEXT NOT NULL,
    total_clicks INTEGER NOT NULL DEFAULT 0,
    last_clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
3. Frontend SetupNavigate to the frontend folder and install dependencies:cd ../frontend
npm install
🏃‍♂️ Running LocallyYou need to run both the backend and frontend servers simultaneously.Terminal 1 (Backend):cd backend
npm run dev
# Server runs on http://localhost:5000
Terminal 2 (Frontend):cd frontend
npm run dev
# UI runs on http://localhost:5173
