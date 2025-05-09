# Chat App

A real-time chat application built with **React**, **Vite**, **Express**, **MongoDB**, and **Socket.IO**.

🔗 [Live Demo](https://chat-app-l3y5.onrender.com)

## Features

- User authentication (signup, login, logout)
- Real-time messaging with Socket.IO
- Online users indicator
- Profile picture upload (Cloudinary)
- Responsive UI with theme switching (DaisyUI + TailwindCSS)
- User list sidebar with online/offline status
- Image sharing in chat
- MongoDB for persistent storage

## Tech Stack

- **Frontend:** React, Vite, Zustand, Axios, DaisyUI, TailwindCSS
- **Backend:** Node.js, Express, Socket.IO, MongoDB (Mongoose), Cloudinary
- **Other:** bcryptjs, JWT, dotenv

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database (local or Atlas)
- Cloudinary account (for image uploads)

### Environment Variables

Create a `.env` file in `server/` with:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chat_app.git
cd chat_app
```

#### 2. Install dependencies

```bash
# In the root folder
cd server
npm install

cd ../client
npm install
```

#### 3. Seed the database (optional)

```bash
cd ../server
node src/seeds/user.seed.js
```

#### 4. Start the backend

```bash
cd server
npm run dev
```

#### 5. Start the frontend

```bash
cd ../client
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Folder Structure

```
chat_app/
  client/      # React frontend
  server/      # Express backend
```

## Scripts

- `npm run dev` — Start development server (frontend or backend)
- `npm run build` — Build for production (frontend)
- `npm start` — Start production server (backend)

---
