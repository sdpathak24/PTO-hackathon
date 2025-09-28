# SmartPTO Setup Guide

## 🚀 Quick Setup

### 1. Install MongoDB (if not already installed)
```bash
# On macOS with Homebrew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

### 2. Create Environment File
Create a `.env` file in the `backend` directory with:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/smartpto

# Server Configuration
PORT=8080

# AI Configuration
GEMINI_API_KEY=AIzaSyCMaqYcVLFgJWj0cs4a3YB7deDQvONPpEQ
```

### 3. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Seed the Database
```bash
cd backend
npm run seed
```

### 5. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🎯 Demo Users
After seeding, you can login with:
- **Employee**: khushi@example.com
- **Manager**: manager@example.com  
- **HR**: hr@example.com

## 📱 Access the App
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## 🛠️ Troubleshooting

### MongoDB Connection Issues
If you get MongoDB connection errors:
1. Make sure MongoDB is running: `brew services list | grep mongodb`
2. Check if MongoDB is accessible: `mongosh mongodb://localhost:27017`

### Port Already in Use
If port 8080 is busy:
1. Kill the process: `lsof -ti:8080 | xargs kill -9`
2. Or change the port in `.env` file

### API Errors
If you see 404 errors:
1. Make sure backend is running on port 8080
2. Check browser console for specific error messages
3. Verify API endpoints are accessible at http://localhost:8080/api/users
