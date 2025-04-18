import express from "express";
import http from "http";
import { Server as socketIO } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

// Initialize express once
const app = express();

app.use(cors());
app.use("/api/auth", authRoutes);
app.use(express.json());

// Message Schema
const messageSchema = new mongoose.Schema({
  text: String,
  user: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// Server Setup
const server = http.createServer(app);
const io = new socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
let connectedUsers = [];

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Socket.io Code
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinChat", ({ username }) => {
    const user = { id: socket.id, username };
    connectedUsers.push(user);
    console.log(`${username} joined the chat`);

    io.emit("userJoined", user);

    io.emit("updateUserList", connectedUsers);
  });

  Message.find()
    .sort({ timestamp: -1 })
    .limit(50)
    .then((messages) => {
      socket.emit("loadMessages", messages);
    })
    .catch((err) => console.error("Error loading messages:", err));

  socket.on("sendMessage", async (messageData) => {
    try {
      const message = new Message({
        text: messageData.text,
        user: messageData.user,
        timestamp: Date.now(),
      });

      const savedMessage = await message.save();
      io.emit("message", savedMessage);
    } catch (err) {
      console.error("Error saving message:", err);
      socket.emit("error", { message: "Error saving message" });
    }
  });

  socket.on("disconnect", () => {
    connectedUsers = connectedUsers.filter((user) => user.id !== socket.id);
    console.log("Client disconnected");

    io.emit("updateUserList", connectedUsers);

    io.emit("userLeft", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  connectDB();
});
