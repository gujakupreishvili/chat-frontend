import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axiosInstance";
import type { UserType } from "../../types/userType";
import { Cookies } from "react-cookie";
import { io, Socket } from "socket.io-client";
import { ChatInput } from "../chatInput/chatInput";
import { jwtDecode } from "jwt-decode";
import { FaUser } from "react-icons/fa";
import { CiSquareRemove } from "react-icons/ci";
import type { DecodedToken, Message } from "../../types/chatTypes";

let socket: Socket;

export default function Sidebar() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [activeChatUserId, setActiveChatUserId] = useState<number | null>(null);
  const [privateChat, setPrivateChat] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const token = new Cookies().get("token");

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log(" Decoded token:", decoded);
      setCurrentUserId(decoded.id);
    } catch (error) {
      console.error(" Invalid token:", error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    socket = io("http://localhost:3001", {
      auth: { token },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("online_users", (users: number[]) => {
      console.log("Online users:", users);
      setOnlineUsers(users);
    });

    socket.on("receive_message", (message: Message) => {
      if (
        message.user_id === activeChatUserId ||
        message.receiver_id === activeChatUserId
      ) {
        console.log(" Received message for active chat:", message);
        setPrivateChat((prev) => [...prev, message]);
      } else {
        console.log(" Received message for other chat:", message);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, activeChatUserId]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axiosInstance.get("api/auth/getAllUsers");
        setUsers(res.data.users);
        console.log(" Users loaded:", res.data.users);
      } catch (error) {
        console.error("Fetch users error:", error);
      }
    };
    getAllUsers();
  }, []);

  useEffect(() => {
    if (!activeChatUserId || !currentUserId) return;

    const loadMessages = async () => {
      try {
        console.log(
          " Loading messages for chat:",
          activeChatUserId,
          "currentUser:",
          currentUserId
        );

        const res = await axiosInstance.get("/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(" All messages from backend:", res.data);

        const filtered = res.data.filter((m: Message) => {
          const sender = Number(m.user_id);
          const receiver =
            m.receiver_id !== null ? Number(m.receiver_id) : null;
          const current = Number(currentUserId);
          const active = Number(activeChatUserId);

          const isMatch =
            (sender === current && receiver === active) ||
            (receiver === current && sender === active);

          console.log(" Checking message:", m, "=> match?", isMatch);
          return isMatch;
        });

        console.log(" Filtered messages for active chat:", filtered);
        setPrivateChat(filtered);
      } catch (err: any) {
        console.error(" Messages fetch error:", err.response?.data || err);
      }
    };

    loadMessages();
  }, [activeChatUserId, currentUserId, token]);

  const openChat = (userId: number) => {
    setActiveChatUserId(userId);
  };

  const sendMessage = async (text: string, file: File | null) => {
    if (!currentUserId || !activeChatUserId) return;

    const formData = new FormData();
    formData.append("text", text);
    formData.append("receiver_id", String(activeChatUserId));
    if (file) formData.append("image", file);

    try {
      await axiosInstance.post("/api/messages", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col p-[12px]">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => openChat(user.id)}
            className={`cursor-pointer p-1 hover:bg-gray-200 ${
              onlineUsers.includes(user.id) ? "font-bold" : ""
            }`}
          >
            <div className=" flex  items-center">
              {onlineUsers.includes(user.id) ? (
                <div className=" border-2 border-green-500 rounded-2xl w-[30px] h-[30px] mx-[5px] flex items-center justify-center">
                  <FaUser className="text-[20px]" />
                </div>
              ) : (
                <div className=" border-2 border-gray-500 rounded-2xl w-[30px] h-[30px] mx-[5px] flex items-center justify-center">
                  <FaUser className="text-[20px]" />
                </div>
              )}
              {user.username}{" "}
            </div>
          </div>
        ))}
      </div>

      {activeChatUserId !== null && (
        <div className=" top-0 left-0 right-0 bottom-0  w-full h-screen fixed bg-white/50 ">
          <div className="flex flex-col absolute bg-white p-3 border rounded shadow right-[20%] bottom-1 gap-[18px] ">
            <div className="flex justify-between items-center">
              <p className="font-bold mb-2">
                Chat with:{" "}
                {users.find((u) => u.id === activeChatUserId)?.username}
              </p>
              <CiSquareRemove
                onClick={() => setActiveChatUserId(null)}
                className="text-[26px] cursor-pointer"
              />
            </div>

            <div className=" bg-gray-100 rounded-l  h-[200px] w-[300px] mb-2 overflow-auto p-1">
              {privateChat.map((msg) => {
                const isCurrentUser = msg.user_id === currentUserId;

                return (
                  <div
                    key={msg.id}
                    className={`max-w-[70%] px-4 py-2 break-words ${
                      isCurrentUser
                        ? "ml-auto bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl my-[12px]"
                        : "mr-auto bg-white text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-md"
                    }`}
                  >
                    {!isCurrentUser && (
                      <div className="font-semibold text-sm text-blue-600 mb-1">
                        {msg.username}
                      </div>
                    )}

                    <div>{msg.text}</div>

                    {msg.image_url && (
                      <img
                        src={msg.image_url}
                        className="w-32 h-auto rounded mt-2"
                        alt="uploaded"
                      />
                    )}

                    <div
                      className={`text-xs mt-1 ${
                        isCurrentUser ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString("ka-GE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <ChatInput onSend={(text, file) => sendMessage(text, file)} />
          </div>
        </div>
      )}
    </>
  );
}
