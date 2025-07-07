
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';


interface ChatWindowProps {
  messages: any[];
  onSend: (msg: any) => void;
}

export const ChatWindow = ({ messages, onSend }: ChatWindowProps) => {


  return (
    <main className="w-full md:w-3/4 flex flex-col h-full bg-white dark:bg-dark">
    

      {/* Chat Log */}
      <div
        className="flex-1 p-6 space-y-6 overflow-y-auto bg-cover bg-center"
        style={{ backgroundImage: "url('/chat_image.png')" }}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            isAi={msg.isAi}
            text={msg.text}
            file={msg.file}
            audioUrl={msg.audioUrl}
              timestamp={msg.timestamp} 
              cardType={msg.cardType}
              cardData={msg.cardData}
          />
        ))}
      </div>

      <ChatInput onSend={onSend} />
    </main>
  );
};