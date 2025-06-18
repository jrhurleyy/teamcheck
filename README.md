# TeamCheck

A full-stack Node.js application with React frontend and Express backend.

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
./start_application.sh
```

### Option 2: Using npm scripts
```bash
# Start both frontend and backend simultaneously
npm run dev

# Or start them individually
npm run start:backend  # Starts the backend server
npm run start:frontend # Starts the React frontend
```

### Option 3: Manual startup
```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start frontend  
cd frontend
npm start
```

## Installation

Install all dependencies for both frontend and backend:
```bash
npm run install:all
```

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## Project Structure

```
teamcheck/
├── backend/          # Express.js backend
├── frontend/         # React frontend
├── start_application.sh  # Startup script
└── package.json      # Root package.json for managing both apps
```
