const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
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

app.get("/", (req, res) => {
  res.send("Server is running!");
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("New client connected");

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
    console.log("Client disconnected");
  });
});
