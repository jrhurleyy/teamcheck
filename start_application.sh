#!/bin/bash

# TeamCheck Application Startup Script
echo "🚀 Starting TeamCheck Application..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to check if dependencies are installed
check_dependencies() {
    local dir=$1
    if [ ! -d "$dir/node_modules" ]; then
        echo "📦 Installing dependencies for $dir..."
        cd "$dir" && npm install
        cd ..
    fi
}

# Check and install dependencies
echo "🔍 Checking dependencies..."
check_dependencies "backend"
check_dependencies "frontend"

echo ""
echo "🎯 Starting backend server..."
echo "Backend will run on: http://localhost:3001 (or configured port)"

# Start backend in the background
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

echo ""
echo "🎨 Starting frontend application..."
echo "Frontend will run on: http://localhost:3000"

# Start frontend
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both applications are starting up!"
echo "=================================="
echo "🖥️  Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both applications"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down applications..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Applications stopped successfully!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
