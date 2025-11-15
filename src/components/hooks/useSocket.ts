import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "../../types/chatTypes";

let socket: Socket | null = null;

interface UseSocketReturn {
  onlineUsers: number[];
  receivedMessage: Message | null;
}

export const useSocket = (
  token: string | null,
  activeChatUserId: number | null
): UseSocketReturn => {
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [receivedMessage, setReceivedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!token) return;

    // ✅ Socket singleton
    if (!socket) {
      socket = io("http://localhost:3001", {
        auth: { token },
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("✅ Connected to socket:", socket?.id);
      });

      socket.on("online_users", (users: number[]) => {
        setOnlineUsers(users);
      });

      socket.on("receive_message", (message: Message) => {
        setReceivedMessage(message); // ყველა მესიჯი პირდაპირ
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });
    }

    // 🔹 არ გავუთიშოთ სინგლტონი, რადგან არ გვსურს ხელახლა შექმნა
    return () => {};
  }, [token, activeChatUserId]); // ახლა activeChatUserId-ც dependencyა

  return { onlineUsers, receivedMessage };
};
