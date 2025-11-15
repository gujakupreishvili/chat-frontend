import { useState, useRef } from "react";
import { FiPaperclip, FiX } from "react-icons/fi";

interface Props {
  onSend: (text: string, file: File | null) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = () => {
    if (!message.trim() && !selectedFile) return;

    onSend(message, selectedFile);
    setMessage("");
    removeFile();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {previewUrl && (
        <div className="mb-3 relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-lg border-2 border-blue-300"
          />
          <button
            onClick={removeFile}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl"
        >
          <FiPaperclip size={20} />
        </button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write message..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim() && !selectedFile}
        >
          Send
        </button>
      </div>
    </div>
  );
}