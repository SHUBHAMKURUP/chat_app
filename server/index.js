const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const messageSchema = new mongoose.Schema({
  text: String,
  user: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Global array to maintain connected users
let connectedUsers = [];

app.get("/", (req, res) => {
  res.send("Server is running!");
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("New client connected");

  // Extract username from query parameters or an initial message
  // For demonstration, we expect the client to emit a "joinChat" event with a username.
  socket.on("joinChat", ({ username }) => {
    // Add user to global list along with socket id
    const user = { id: socket.id, username };
    connectedUsers.push(user);
    console.log(`${username} joined the chat`);

    // Emit that a new user has joined (to the current socket or broadcast)
    io.emit("userJoined", user);
    // Update the entire user list for everyone
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

  // Handle user disconnect
  socket.on("disconnect", () => {
    // Remove the disconnected user from the global list
    connectedUsers = connectedUsers.filter((user) => user.id !== socket.id);
    console.log("Client disconnected");
    // Broadcast updated user list
    io.emit("updateUserList", connectedUsers);
    // Optionally, you could also emit a "userLeft" event if needed:
    io.emit("userLeft", socket.id);
  });
});
