"use client";

import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import Loader from "./Loader";
import UserContext from "../Context/user/userContext";

// Define custom events interfaces
interface ServerToClientEvents {
  message: (msg: string) => void;
}

interface ChatPageProps {
  id: string;
}

export default function ChatPage({ id }: ChatPageProps) {
  const socketURL:any = "https://face-algo-socket.onrender.com";
  // const socketURL: any = "http://localhost:3001";
  const { getUser } = useContext<any>(UserContext);
  const [socket, setSocket] = useState<any>(undefined);
  const [message, setMessage] = useState<string>("");
  const [inbox, setInbox] = useState<any>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [roomName, setRoomName] = useState("");
  const [typing, setTyping] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [isTyping, setIsTyping] = useState("");
  const [display, setDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState<any>([]);

  const getChats = async () => {
    setLoading(true);
    try {
      const d = await getUser();
      if (d.success) {
        setUser(d.user);
      }
      const { data: allChatsData } = await axios.get("/api/chat/");
      setChats(allChatsData.chats);

      if (id.length > 0) {
        const { data: chatData } = await axios.get(`/api/chat/${id}`);
        console.log("selected chat: ", chatData.chat);
        setCurrentChat(chatData.chat);

        joinChat(chatData?.chat?._id);
        const { data } = await axios.get(`/api/message/${chatData?.chat?._id}`);
        if (data.success) {
          setInbox(data.msg);
        }
        setDisplay(true);
      }
    } catch (error) {
      console.log("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    if (chats.length === 0 || !user) return; // Exit if chats are not loaded or user is not set

    const socketInstance = io(socketURL);
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    socketInstance.emit("setup", { _id: user._id, email: user.email });

    socketInstance.on("online-users", (users) => {
      // console.log(users);
      const onlineUsers = users.reduce((acc: any, user: any) => {
        acc[user] = true;
        return acc;
      }, {});

      setOnline(onlineUsers);
      console.log(onlineUsers);

      const onlineChats = [];
      const offlineChats = [];

      for (let chat of chats) {
        if (chat?.users[0]?._id && onlineUsers[chat.users[0]._id]) {
          onlineChats.push(chat);
        } else {
          offlineChats.push(chat);
        }
      }
      // console.log("online: ", onlineChats);
      // console.log("offline: ", offlineChats);
      // setOnline(onlineChats);
      // setOffline(offlineChats);
    });

    socketInstance.on("message received", (msg) => {
      console.log("message received: ", msg);
      setInbox((prevInbox: any) => [...prevInbox, msg]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [chats, user]);

  useEffect(() => {
    console.log("hello");
    const socketInstance = io(socketURL);
    setSocket(socketInstance);
  
    socketInstance.emit("setup", user);
  
    socketInstance.on("connected", () => {
      console.log("Connected to socket server");
    });
  
    socketInstance.on("typing", (msg) => {
      console.log("User is typing: ", msg);
      setIsTyping(msg);
    });
  
    socketInstance.on("stop typing", () => {
      setIsTyping("");
    });
  
    return () => {
      socketInstance.disconnect(); // Clean up the socket connection
    };
  }, [chats, user]);
  

  const sendMessage = async () => {
    socket?.emit("stop typing", currentChat?._id);
    setIsTyping("");
    const now = new Date();
    let hour = now.getHours();
    if (hour == 0) {
      hour = 12;
    }

    let min = now.getMinutes();

    if (message) {
      // socket?.emit("stop typping", selectedChat?._id);
      try {
        setMessage("");
        let a = "pm";
        if (hour < 12) {
          a = "am";
        }
        const { data } = await axios.post("/api/message/", {
          userId: user?._id,
          content: message,
          chatId: currentChat._id,
          time:
            hour > 12
              ? `${hour - 12}:${min < 10 ? "0" + min : min} ${a}`
              : `${hour}:${min} ${a}`,
        });
        console.log("message: ", data);

        if (data.success) {
          socket?.emit("new message", data.msg);
          if (data.success) {
            setInbox((prevInbox: any) => [...prevInbox, data.msg]);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        // scrollToBottom();
      }
    }
  };

  // useEffect(() => {
  //   // Scroll to the bottom whenever messages change
  //   // scrollToBottom();
  // }, []);

  const handleClick = async (chat: any) => {
    setLoading(true);
    joinChat(chat?._id);
    setCurrentChat(chat);
    const { data } = await axios.get(`/api/message/${chat?._id}`);
    if (data.success) {
      setInbox(data.msg);
    }
    setDisplay(true);
    setLoading(false);
  };

  const joinChat = (room: string) => {
    if (socket) {
      socket.emit("join chat", room);
      setRoomName(room);
      console.log(`Joined room: ${room}`);
    }
  };

  const handleTyping = async (e: any) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
    }
    socket?.emit("typing", currentChat?._id, e.target.value);
    // Clear previous timeout and set a new one
    clearTimeout(typingTimeout);
    const typingTimeout1 = setTimeout(() => {
      setTyping(false);
      socket?.emit("stop typing", currentChat?._id);
      setIsTyping("");
    }, 5000); // 5 seconds delay

    setTypingTimeout(typingTimeout1);
  };

  const onEnter = (e: any) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="bg-green-100 m-0 p-0 h-screen flex flex-col">
      <div className="flex flex-grow">
        <div
          className={`${
            display ? "hidden" : "w-[100vw]"
          } md:block md:w-[35vw] bg-white text-black p-4 overflow-auto md:text-md overflow-y-scroll fixed left-0 top-[3rem] h-full`}
        >
          {chats &&
            chats.length > 0 &&
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`p-2 border-b flex gap-3 rounded-md ${
                  currentChat?._id === chat?._id ? "bg-gray-300" : "bg-white"
                }`}
                onClick={() => {
                  handleClick(chat);
                }}
              >
                <img
                  src={chat.users[0]?._id === user?._id ?  chat.users[1].imageUrl : chat.users[0].imageUrl || ""}
                  alt="#"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex gap-3">
                  <>{chat.users[0]?._id === user?._id ? chat.users[1].name : chat.users[0].name}</>
                  <div
                    className={`${
                      online[(chat.users[0]?._id === user?._id) ? chat.users[1]?._id : chat.users[0]?._id] &&
                      "bg-green-600 w-2 h-2 rounded-full mt-2"
                    }`}
                  >
                    {online[chat.users[0]._id]}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {currentChat ? (
          <div
            className={`${
              display ? "w-[100vw]" : "hidden"
            } md:flex md:w-[65vw] flex flex-col bg-green-100 h-[88%] md:h-[84%] fixed right-0 top-[3rem] overflow-y-scroll`}
          >
            <div className="w-full text-center p-1 bg-white/40 text-black flex">
              <div
                className="md:hidden back px-2 bg-white/50 w-fit"
                onClick={() => {
                  setDisplay(false);
                }}
              >
                {"<-"}
              </div>
              <div className="m-auto">
                <p className="!text-center w-full text-sm">
                  {currentChat.users[0]?._id === user?._id ? currentChat.users[1].name : currentChat.users[0].name}
                </p>
                <p className="!text-center w-full text-green-600 text-xs">
                  {online[(currentChat.users[0]?._id === user?._id) ? currentChat.users[1]?._id : currentChat.users[0]?._id] ? "online" : ""}
                </p>
              </div>
            </div>
            <div className="flex-grow p-4 overflow-auto">
              {inbox?.map((msg: any, index: any) => (
                <div
                  key={index}
                  className={`px-2 flex py-1 md:py-2 md:px-3 text-sm lg:text-md lg:px-3 bg-white my-2 shadow w-fit rounded-xl ${
                    msg.sender === user?._id
                      ? "bg-green-300 ml-auto"
                      : "bg-white"
                  }`}
                >
                  {msg.content}
                  <p className="text-[10px] relative top-2 ml-1">{msg.time}</p>
                </div>
              ))}
            </div>

            <div className="pt-1 bg-green-100 w-full ml-2 fixed bottom-0">
              {isTyping.length > 0 && (
                <div className="typing bg-blue-200 px-2 flex py-1 text-sm lg:text-md lg:px-3 w-fit rounded-xl my-1">
                  {isTyping + "..."}
                </div>
              )}
              <div
                className="flex w-full md:w-[63vw] gap-1"
                onKeyDown={onEnter}
              >
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  className={`p-2 border rounded mb-2 bg-white text-black w-full`}
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className={`md:flex bg-green-200 !w-[40px] h-[40px] rounded-md mr-3 md:mr-0`}
                >
                  <img
                    src="/images/send.png"
                    alt="#"
                    width={20}
                    className="m-auto"
                  />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${
              display ? "w-[100vw]" : "hidden"
            } md:flex md:w-[65vw] flex flex-col bg-green-100 fixed right-0 top-[3rem] h-full items-center`}
          >
            <p className="text-center align-middle text-xl font-semibold mt-[40vh]">
              Select a Chat!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
