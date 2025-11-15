import { useState, useRef } from "react";
import { AiOutlinePaperClip, AiOutlineClose } from "react-icons/ai";

export function ChatInput({ onSend }: { onSend: (text: string, file: File | null) => void }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const send = () => {
    if (!text.trim() && !file) return;
    onSend(text, file);
    setText("");
    removeFile();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col gap-2">

      {previewUrl && (
        <div className="relative w-fit">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-300"
          />
          <button
            onClick={removeFile}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <AiOutlineClose size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Write message..."
          className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />


        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />


        <button
          onClick={openFileDialog}
          className="text-2xl text-gray-600 hover:text-gray-800 transition-colors"
          type="button"
        >
          <AiOutlinePaperClip />
        </button>

        <button
          onClick={send}
          disabled={!text.trim() && !file}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}