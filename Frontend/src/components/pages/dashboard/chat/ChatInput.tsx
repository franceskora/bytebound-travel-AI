// ChatInput.tsx
import { useState, useRef } from "react";
import { PlusCircle, Mic, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: any) => void; // will be ChatMessageType
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


 const handleSendClick = () => {
  if (!input.trim() && !selectedFile) return;

  const message: any = {};
  if (input.trim()) message.text = input.trim();
  if (selectedFile) {
    message.file = {
      name: selectedFile.name,
      url: URL.createObjectURL(selectedFile),
      type: selectedFile.type
    };
  }

  onSend(message);
  setInput("");
  setSelectedFile(null);
};


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendClick();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedFile(file);
  }
};


  // Very basic voice recording with MediaRecorder
  const handleMicClick = async () => {
    if (!navigator.mediaDevices) {
      alert("Audio recording not supported");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(blob);
      onSend({ audioUrl });
    };

    recorder.start();

    setTimeout(() => {
      recorder.stop();
      stream.getTracks().forEach(track => track.stop());
    }, 3000); // Record for 3 sec for demo
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full p-2">
        {selectedFile && (
  <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-600 rounded shadow-sm">
    {selectedFile.type.startsWith("image/") ? (
      <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-16 h-16 object-cover rounded" />
    ) : (
      <span className="text-sm">{selectedFile.name}</span>
    )}
    <button onClick={() => setSelectedFile(null)} className="text-xs text-red-500">Remove</button>
  </div>
)}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <button type="button" onClick={handleFileClick} className="p-2 text-primary hover:bg-secondary transition bg-light dark:bg-gray-800 dark:hover:bg-gray-700">
          <PlusCircle size={22} />
        </button>

        <input
          type="text"
          placeholder="Enter a prompt here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none px-2 text-sm"
        />

        <button type="button" onClick={handleMicClick} className="p-2 text-primary hover:bg-secondary transition bg-light dark:bg-gray-800 dark:hover:bg-gray-700">
          <Mic size={22} />
        </button>

        <button type="button" onClick={handleSendClick} className="p-2 text-white bg-primary dark:bg-green rounded-full hover:bg-primary/90">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};