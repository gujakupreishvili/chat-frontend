import { useRef, useEffect } from "react";
import type { Message } from "./chatGlobal";

interface Props {
  chat: Message[];
  currentUserId: number | null;
}

export default function ChatMessages({ chat, currentUserId }: Props) {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="h-[500px] overflow-y-auto p-4 bg-gray-50">
      {chat.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No messages yet...</p>
      ) : (
        chat.map((msg) => {
          const isCurrentUser = msg.user_id === currentUserId;

          return (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl"
                    : "bg-white text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-md"
                } px-4 py-3`}
              >
                {!isCurrentUser && (
                  <div className="font-semibold text-sm text-blue-600 mb-1">
                    {msg.username}
                  </div>
                )}

                <div className="break-words">{msg.text}</div>

                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    className="w-48 h-auto rounded-lg mt-2 border-2 border-white/20"
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
            </div>
          );
        })
      )}

      <div ref={chatEndRef}></div>
    </div>
  );
}