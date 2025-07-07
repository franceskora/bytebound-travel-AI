
import { useState, useRef } from "react";
import { PlusCircle, Mic, Send, Check, X } from "lucide-react";
import { recordAudio } from "../../../../utils/recordAudio";
import { transcribeAudio } from "../../../../lib/api";

interface ChatInputProps {
  onSend: (message: any) => void; 
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  

  const recognitionRef = useRef<SpeechRecognition | null>(null);
 

const handleSendClick = () => {
    if (!input.trim() && !selectedFile) return;

    const message: any = {};
    if (input.trim()) {
      message.text = input.trim();
      message.transcribed = transcript.length > 0;
    }
    if (selectedFile) {
      message.file = {
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        type: selectedFile.type,
      };
    }

    onSend(message);
    setInput("");
    setSelectedFile(null);
    setTranscript("");
  };



   const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendClick();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };


const handleMicClick = async () => {
  try {
    setIsListening(true); 

    const audioBlob = await recordAudio();

    // You can choose to auto-transcribe immediately OR wait for confirm
    const { text } = await transcribeAudio(audioBlob);

    setTranscript(text || "");

    // Note: Don’t auto-setInput() if you want user to confirm first
  } catch (err) {
    console.error("Voice recording failed:", err);
    alert("Error recording or transcribing audio.");
    setIsListening(false);
  }
};

const stopListening = () => {
  recognitionRef.current?.stop();
  setIsListening(false);
};


const handleConfirmDictation = async () => {
    stopListening();
    setIsProcessing(true);

    // Simulate processing delay (could run grammar fix API here)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setInput(transcript);
    setIsProcessing(false);
    setTranscript("");
  };

  const handleCancelDictation = () => {
    stopListening();
    setTranscript("");
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
          placeholder={
            isListening
              ? "Listening... Speak now!"
              : isProcessing
              ? "Processing voice input..."
              : "Enter a prompt here..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className="w-full bg-transparent outline-none px-2 text-sm"
        />

        {!isListening && (
          <button
            type="button"
            onClick={handleMicClick}
            className="p-2 rounded-full transition text-primary hover:bg-secondary bg-light dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Mic size={22} />
          </button>
        )}

        {isListening && (
          <>
            <button
              type="button"
              onClick={handleCancelDictation}
              className="p-2 text-red-600"
              title="Cancel"
            >
              <X size={22} />
            </button>
            <button
              type="button"
              onClick={handleConfirmDictation}
              className="p-2 text-green-600"
              title="Confirm"
            >
              <Check size={22} />
            </button>
          </>
        )}


       <button
          type="button"
          onClick={handleSendClick}
          disabled={isProcessing}
          className="p-2 text-white bg-primary dark:bg-green rounded-full hover:bg-primary/90"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
