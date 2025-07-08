import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

// --- THIS IS THE FIX ---
// Define a specific type for a message object.
// This tells TypeScript the exact shape of the data.
interface Message {
  id: number;
  isAi: boolean;
  text?: string;
  timestamp: string;
  // This 'cardType' now perfectly matches what ChatMessage expects.
  cardType?: 'activity' | 'flight' | 'hotel' | 'itinerary'; 
  cardData?: any;
  file?: any;
  audioUrl?: string;
}
// --------------------

interface ChatWindowProps {
  // Use the specific Message type for the array.
  messages: Message[];
  onSend: (msg: Partial<Message>) => void;
}

export const ChatWindow = ({ messages, onSend }: ChatWindowProps) => {
  return (
    <main className="w-full md:w-3/4 flex flex-col h-full bg-white dark:bg-dark">
      {/* Chat Log */}
      <div
        className="flex-1 p-6 space-y-6 overflow-y-auto bg-cover bg-center"
        style={{ backgroundImage: "url('/chat_image.png')" }}
      >
        {/* Loop through each message and render it */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            isAi={msg.isAi}
            text={msg.text}
            file={msg.file}
            audioUrl={msg.audioUrl}
            timestamp={msg.timestamp}
            cardType={msg.cardType} // This will now be type-safe
            cardData={msg.cardData}
          />
        ))}
      </div>

      {/* The input component at the bottom */}
      <ChatInput onSend={onSend} />
    </main>
  );
};