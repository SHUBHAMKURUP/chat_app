import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { IoSettingsOutline } from "react-icons/io5";
import Avatar from "react-avatar";
import profile from "./utils/profile.png";
const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const username = `User_${Math.floor(Math.random() * 1000)}`;
    setCurrentUser(username);

    socket.emit("joinChat", { username });

    socket.on("userJoined", (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on("userLeft", (userId) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    });

    socket.on("updateUserList", (userList) => {
      setUsers(userList);
    });

    socket.on("message", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("message");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("updateUserList");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      text: message,
      sender: currentUser,
      timestamp: new Date(),
      recipient: selectedChat,
    };

    socket.emit("sendMessage", messageData);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="grid grid-cols-12 h-screen">
      {/* Left Sidebar - Profile */}
      <div className="col-span-2 bg-gray-800 p-4">
        <div className="flex items-center space-x-2">
          <Avatar src={profile} size="40" round={true} />
          <IoSettingsOutline className="text-white text-xl cursor-pointer" />
        </div>
      </div>

      {/* Middle Section - Chat List */}
      <div className="col-span-3 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-semibold">Chats</h2>
          <div className="mt-4 space-y-2">
            {/* Chat List Items */}
            {users.map((user, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => setSelectedChat(user.username)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar size="40" round={true} name={user.username} />
                  <div>
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-sm text-gray-500">Last message...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Chat Messages */}
      <div className="col-span-7 bg-gray-100 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 flex items-center space-x-3 border-b">
          <Avatar
            size="40"
            round={true}
            name={selectedChat || "Current Chat"}
          />
          <h2 className="font-medium">{selectedChat || "Current Chat"}</h2>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.sender === currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  msg.sender === currentUser
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-black"
                } rounded-lg p-3 max-w-[70%]`}
              >
                <p>{msg.text}</p>
                <small className="block text-xs text-gray-500">
                  {msg.timestamp &&
                    new Date(msg.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
