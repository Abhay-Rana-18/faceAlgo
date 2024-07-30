"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

// Define custom events interfaces
interface ServerToClientEvents {
  message: (msg: string) => void;
}

interface ChatPageProps {
  id: string;
}

export default function ChatPage({ id }: ChatPageProps) {
  const socketURL:any = "https://face-algo-socket.onrender.com";
  const [socket, setSocket] = useState<any>(undefined);
  const [message, setMessage] = useState<string>("");
  const [inbox, setInbox] = useState<any>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [user, setUser] = useState<any>();
  const [roomName, setRoomName] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [isTyping, setIsTyping] = useState("");
  const [display, setDisplay] = useState(false);

  const getChats = async () => {
    await getUser();
    try {
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
    }
  };

  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/users/details");
      if (data.success) {
        setUser(data.user);
        console.log("user: ", data.user);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    const socketInstance = io(socketURL);
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    if (user) {
      socketInstance.emit("setup", { _id: user?._id, email: user?.email });
    }

    socketInstance.on("message received", (msg) => {
      console.log("message received: ", msg);
      setInbox((prevInbox: any) => [...prevInbox, msg]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [id, user]);

  useEffect(() => {
    const socketInstance = io(socketURL);
    setSocket(socketInstance);
    socketInstance.emit("setup", user);
    socketInstance.on("connected", () => {});
    socketInstance.on("typing", (msg) => {
      setIsTyping(msg);
    });
    socketInstance.on("stop typing", () => {
      setIsTyping("");
    });
  }, [id, user]);

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
      }
    }
  };

  const handleClick = async (chat: any) => {
    joinChat(chat?._id);
    setCurrentChat(chat);
    const { data } = await axios.get(`/api/message/${chat?._id}`);
    if (data.success) {
      setInbox(data.msg);
    }
    setDisplay(true);
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

  return (
    <div className="bg-gray-200 m-0 p-0 h-screen flex flex-col">
      <div className="flex flex-grow overflow-hidden">
        <div
          className={`${
            display ? "hidden" : "w-[100vw]"
          } md:block md:w-[35vw] bg-green-50 text-black p-4 overflow-auto md:text-md`}
        >
          {chats &&
            chats.length > 0 &&
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`p-2 border-b flex gap-3 ${
                  currentChat?._id === chat?._id
                    ? "bg-black/20"
                    : "bg-green-white"
                }`}
                onClick={() => {
                  handleClick(chat);
                }}
              >
                <img
                  src={
                    chat?.users[0].email === user?.email
                      ? chat?.users[1].imageUrl
                      : chat.users[0].imageUrl || ""
                  }
                  alt="#"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                {chat?.users[0].email === user?.email
                  ? chat?.users[1].email
                  : chat.users[0].email}
              </div>
            ))}
        </div>

        {currentChat ? (
          <div
            className={`${
              display ? "w-[100vw]" : "hidden"
            } md:flex md:w-[65vw] flex flex-col bg-green-200/60`}
          >
            <div className="w-full text-center p-3 bg-white/40 text-black flex">
              <div
                className="md:hidden back px-2 bg-black/50 w-fit"
                onClick={() => {
                  setDisplay(false);
                }}
              >
                {"<-"}
              </div>
              <p className="!text-center w-full">
                {currentChat?.users[0].email === user?.email
                  ? currentChat?.users[1].email
                  : currentChat?.users[0].email}
              </p>
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

            <div className="pt-1 bg-green-200/60 w-full ml-2 fixed bottom-0">
              {isTyping.length>0 && (
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
                  className={`hidden md:flex bg-green-600 !w-[40px] h-[40px] rounded-md`}
                >
                  <img
                    src="/images/send-message.png"
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
            } md:flex md:w-[65vw] flex flex-col bg-green-200/60`}
          >
            <p className="text-center align-middle text-xl font-bold mt-[40vh]">
              Select a Chat!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
