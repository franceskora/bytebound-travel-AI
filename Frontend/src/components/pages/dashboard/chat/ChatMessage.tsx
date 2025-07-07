import { AiFlightCard } from "./AiFlightCard";
import { FlightOffer } from "../../../../lib/types";

interface ChatMessageProps {
  isAi: boolean;
  text?: string;
  timestamp: string;
  file?: { name: string; url: string; type?: string };
  audioUrl?: string;
  cardType?: "activity" | "flight" | "hotel" ;
  cardData?: any;
}

export const ChatMessage = ({
  isAi,
  text,
  file,
  audioUrl,
  timestamp,
  cardType,
  cardData,
}: ChatMessageProps) => {
  const baseClasses = "max-w-xl p-3 rounded-lg";
  const aiClasses = "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none";
  const userClasses = "bg-primary dark:bg-green text-white rounded-br-none";
  const alignment = isAi ? "justify-start" : "justify-end";
  const isImage = file?.type?.startsWith("image/");

  const renderContent = () => {
   if (cardType === 'flight' && cardData.offers) {
  return cardData.offers.map((o: FlightOffer) => (
    <AiFlightCard key={o.id} offer={o} onSelect={(id) => console.log('select',id)} />
  ));
}

    return (
      <>
        {text && <p className="text-sm mb-2">{text}</p>}
        {file && (
          <div>
            {isImage ? (
              <img src={file.url} alt={file.name} className="max-w-xs rounded" />
            ) : (
              <a href={file.url} download={file.name} className="underline text-sm">
                📎 {file.name}
              </a>
            )}
          </div>
        )}
        {audioUrl && <audio controls src={audioUrl} className="mt-2 w-full" />}
      </>
    );
  };

  return (
    <div className={`flex ${alignment}`}>
      <div className={`${baseClasses} ${isAi ? aiClasses : userClasses} relative`}>
        {renderContent()}
        <span className="block text-xs text-pink-600 dark:text-pink-300 mt-2 text-right">
          {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};
