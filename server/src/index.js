import express from "express";
import http from "http";
import { Server as socketIO } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import path from "path";
// Initialize express once

dotenv.config();

const PORT = process.env.PORT;

const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

// Server Setup
// const server = http.createServer(app);
// const io = new socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

//let connectedUsers = [];

// Routes
// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });

// Socket.io Code
// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("joinChat", ({ username }) => {
//     const user = { id: socket.id, username };
//     connectedUsers.push(user);
//     console.log(`${username} joined the chat`);

//     io.emit("userJoined", user);

//     io.emit("updateUserList", connectedUsers);
//   });

//   Message.find()
//     .sort({ timestamp: -1 })
//     .limit(50)
//     .then((messages) => {
//       socket.emit("loadMessages", messages);
//     })
//     .catch((err) => console.error("Error loading messages:", err));

//   socket.on("sendMessage", async (messageData) => {
//     try {
//       const message = new Message({
//         text: messageData.text,
//         user: messageData.user,
//         timestamp: Date.now(),
//       });

//       const savedMessage = await message.save();
//       io.emit("message", savedMessage);
//     } catch (err) {
//       console.error("Error saving message:", err);
//       socket.emit("error", { message: "Error saving message" });
//     }
//   });

//   socket.on("disconnect", () => {
//     connectedUsers = connectedUsers.filter((user) => user.id !== socket.id);
//     console.log("Client disconnected");

//     io.emit("updateUserList", connectedUsers);

//     io.emit("userLeft", socket.id);
//   });
// });

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  connectDB();
});
