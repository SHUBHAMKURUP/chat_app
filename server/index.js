// Load required modules
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Define the port from environment variables or default to 5000.
const PORT = process.env.PORT || 5000;

// An example route to check that your server is working.
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start listening for client connections on the specified port.
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Listen for new socket connections.
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Listen for 'sendMessage' events from the client.
  socket.on("sendMessage", (messageData) => {
    console.log("Message received: ", messageData);

    // Emit the message to all connected clients.
    io.emit("message", messageData);
  });

  // Handle socket disconnect event.
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
