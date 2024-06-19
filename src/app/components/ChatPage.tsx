"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Optionally, define your custom events interfaces
interface ServerToClientEvents {
  message: (msg: string) => void;
  // Add more events from server to client if needed
}

interface ClientToServerEvents {
  sendMessage: (msg: string) => void;
  // Add more events from client to server if needed
}

export default function () {
  const [socket, setSocket] = useState<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >(undefined);
  const [message, setMessage] = useState<String>("");
  const [roomName, setRoomName] = useState<String>("");
  const [inbox, setInbox] = useState<string[]>([]);
  const [chats, setChats] = useState<any>([]);
  useEffect(() => {
    const gettingChats = async() => {
      const {data} = await axios.get("/api/chat");
      setChats(data.chats);
      console.log(chats);
    };
    gettingChats();
    const handleMessage = (msg) => {
      console.log("rec");
      setInbox((prevInbox) => [...prevInbox, msg]);
    };
    const socket = io("http://localhost:3001");
    setSocket(socket);
    socket?.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", handleMessage);
    setSocket(socket);
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const sendMessage = () => {
    socket?.emit("message", message);
  };

  return (
    <div className="m-2 bg-gray-200">
      <h1 className="text-black text-center bg-blue-200 p-3 text-xl">Chat</h1>

      <div className="chatSpace flex">
        <div className="chatProfiles">
          {chats?.map((chat) => (
            <div>{chat.name}</div>
          ))}
        </div>
        <div className="msgChat">
          <input
            type="text"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button
            onClick={sendMessage}
            className="p-1 bg-blue-600 rounded-md text-white"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
