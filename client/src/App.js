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

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Chats
        </h2>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-lg">
          {/* Messages Area */}
          <div className="h-[500px] p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col">
                  <div className="bg-blue-100 rounded-lg p-3 max-w-[70%] break-words">
                    <p className="font-semibold text-sm text-gray-600">
                      {msg.sender}
                    </p>
                    <p className="text-gray-800">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
