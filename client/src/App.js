import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    const messageData = { text: message, sender: "User" };

    socket.emit("sendMessage", messageData);

    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat_App</h2>
      <div
        style={{
          height: "300px",
          border: "1px solid #ccc",
          padding: "10px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "80%", padding: "10px" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "10px 20px", marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
