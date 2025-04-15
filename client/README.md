# Real-time Chat Application

## Demo

[]

## Overview

A real-time chat application built using MERN stack (MongoDB, Express, React, Node.js) with Socket.IO for real-time communication.

## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Real-time: Socket.IO

## Features

- Real-time messaging
- Message history
- Timestamps
- User identification
- MongoDB persistence

## Project Structure

```
chat_app/
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── server/          # Node.js backend
    ├── index.js
    ├── .env
    └── package.json
```

## Setup Instructions

### Backend Setup

# Install backend dependencies

```bash
cd server
npm install

# Configure .env file
cp .env.example .env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
node index.js
```

### Frontend Setup

```bash
cd client
npm install
npm start
```
