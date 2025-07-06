import { AiFlightCard } from "./AiFlightCard";
import { AiHotelCard } from "./AiHotelCard";
import { AiActivityCard } from "./AiActivityCard";

// The props interface is updated to accept flight, hotel, or activity data
interface ChatMessageProps {
  isAi: boolean;
  text?: string;
  timestamp: string;
  file?: {
    name: string;
    url: string;
    type?: string;
  };
  audioUrl?: string;
  // Add new optional props for our rich cards
  flightOffer?: any; // The JS engineer will replace 'any' with a real type
  hotelOffer?: any;
  activity?: any;
}

export const ChatMessage = ({ 
  isAi, 
  text, 
  file, 
  audioUrl, 
  timestamp,
  flightOffer,
  hotelOffer,
  activity 
}: ChatMessageProps) => {

  const baseClasses = "max-w-xl p-3 rounded-lg";
  const aiClasses = "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none";
  const userClasses = "bg-primary dark:bg-green text-white rounded-br-none";
  const alignmentClass = isAi ? "justify-start" : "justify-end";
  const isImage = file?.type?.startsWith("image/");

  return (
    <div className={`flex ${alignmentClass}`}>
      <div className={`${baseClasses} ${isAi ? aiClasses : userClasses} relative`}>
        
        {/* ================================================================= */}
        {/* ====== START: NEW CONDITIONAL RENDERING FOR CARDS =============== */}
        {/* ================================================================= */}

        {flightOffer ? (
          <AiFlightCard /> // If there's flight data, show the flight card
        ) : hotelOffer ? (
          <AiHotelCard /> // If there's hotel data, show the hotel card
        ) : activity ? (
          <AiActivityCard /> // If there's activity data, show the activity card
        ) : (
          <>
            {/* This is your existing code for text, files, and audio */}
            {text && <p className="text-sm mb-2">{text}</p>}
            {file && (
              <div>
                {isImage ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="max-w-xs rounded"
                  />
                ) : (
                  <a href={file.url} download={file.name} className="underline text-sm">
                    📎 {file.name}
                  </a>
                )}
              </div>
            )}
            {audioUrl && (
              <audio controls src={audioUrl} className="mt-2 w-full" />
            )}
          </>
        )}
        
        {/* ================================================================= */}
        {/* ====== END: NEW CONDITIONAL RENDERING FOR CARDS ================= */}
        {/* ================================================================= */}

        {/* Timestamp - this existing code is untouched */}
        <span className="block text-xs text-pink-600 dark:text-pink-300 mt-2 text-right">
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};