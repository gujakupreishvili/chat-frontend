import { useEffect, useState } from "react";
import socket from "../../config/socket";
import { axiosInstance } from "../../lib/axiosInstance";
import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import ChatMessages from "./chatMessages";
import ChatInput from "./chatInput";

export interface Message {
  id: number;
  text: string;
  user_id: number;
  receiver_id: number | null;
  username?: string;
  created_at: string;
  image_url?: string | null;
}

interface DecodedToken {
  id: number;
  username: string;
  email: string;
}

export default function ChatGlobal() {
  const [chat, setChat] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const cookies = new Cookies();
  const token = cookies.get("token");


  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setCurrentUserId(decoded.id);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, [token]);

  
  useEffect(() => {
    if (!token) return;

    axiosInstance
      .get("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const msgs = res.data.filter(
          (msg: Message) => msg.receiver_id === null
        );
        setChat(msgs);
      })
      .catch(console.error);
  }, [token]);


  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    socket.on("receive_message", (data: Message) => {
      if (data.receiver_id === null) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [token]);


  const sendMessage = async (text: string, file: File | null) => {
    if (!text.trim() && !file) return;
    if (!currentUserId) return;

    const formData = new FormData();
    formData.append("text", text);
    formData.append("receiver_id", ""); 
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">
          Global Chat
        </h2>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <ChatMessages chat={chat} currentUserId={currentUserId} />
          <ChatInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}