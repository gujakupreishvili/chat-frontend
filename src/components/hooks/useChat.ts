import { useEffect, useState } from "react";
import type { Message, UserType } from "../../types/chatTypes";
import { axiosInstance } from "../../lib/axiosInstance";

export const useChat = (
  token: string | null,
  currentUserId: number | null,
  activeChatUserId: number | null,
  receivedMessage: Message | null
) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [privateChat, setPrivateChat] = useState<Message[]>([]);

  // 1️⃣ Fetch all users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/getAllUsers");
        setUsers(res.data.users);
      } catch (error) {
        console.error("❌ Fetch users error:", error);
      }
    };
    getAllUsers();
  }, []);

  // 2️⃣ Load chat history when active chat changes
  useEffect(() => {
    if (!activeChatUserId || !currentUserId || !token) {
      setPrivateChat([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const res = await axiosInstance.get("/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered: Message[] = res.data.filter((m: Message) => {
          const sender = Number(m.user_id);
          const receiver = m.receiver_id !== null ? Number(m.receiver_id) : null;
          const current = Number(currentUserId);
          const active = Number(activeChatUserId);

          return (
            (sender === current && receiver === active) ||
            (receiver === current && sender === active)
          );
        });

        setPrivateChat(filtered);
      } catch (err: any) {
        console.error("❌ Messages fetch error:", err.response?.data || err);
      }
    };

    loadMessages();
  }, [activeChatUserId, currentUserId, token]);

  // 3️⃣ Handle incoming socket messages
  useEffect(() => {
    if (!receivedMessage || !currentUserId || !activeChatUserId) return;

    const isForCurrentUser =
      receivedMessage.receiver_id === currentUserId ||
      receivedMessage.sender_id === currentUserId;

    const isForActiveChat =
      receivedMessage.sender_id === activeChatUserId ||
      receivedMessage.receiver_id === activeChatUserId;

    if (isForCurrentUser && isForActiveChat) {
      setPrivateChat((prev) => {
        if (prev.some((m) => m.id === receivedMessage.id)) return prev;
        return [...prev, receivedMessage];
      });
    }
  }, [receivedMessage, currentUserId, activeChatUserId]);

  // 4️⃣ Send message
  const sendMessage = async (text: string, file: File | null) => {
    if (!currentUserId || !activeChatUserId || !token) return;
    if (!text.trim() && !file) return;

    const tempMessage: Message = {
      id: Date.now(), // დროებითი id
      user_id: currentUserId,
      sender_id: currentUserId, // TypeScript-ისთვის აუცილებელი
      receiver_id: activeChatUserId,
      text,
      image_url: file ? URL.createObjectURL(file) : "", // დროებითი თუ ფაილი გაქვს
      created_at: new Date().toISOString(),
      username: users.find(u => u.id === currentUserId)?.username || "You",
    };

    // 📩 UI-ში დავამატოთ პირდაპირ
    setPrivateChat((prev) => [...prev, tempMessage]);

    // 1️⃣ გავაგზავნოთ backend-ში
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
      console.error("❌ Send message error:", error);
      // ⚠️ წაშალე tempMessage თუ იგზავნა ვერ
      setPrivateChat((prev) => prev.filter(m => m.id !== tempMessage.id));
    }
  };

  return { users, privateChat, sendMessage };
};
