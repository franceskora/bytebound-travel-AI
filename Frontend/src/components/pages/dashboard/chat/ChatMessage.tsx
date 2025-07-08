import { AiFlightCard } from "./AiFlightCard";
import { FlightOffer, HotelOffer, ActivityData, ItineraryData } from "../../../../lib/types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Placeholder card components (replace with real ones if available)
const AiHotelCard = ({ offer }: { offer: HotelOffer }) => (
  <div className="max-w-md p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border mb-2">
    <h4 className="font-bold">{offer.name}</h4>
    <p className="text-xs text-gray-500 mb-2">{offer.address}</p>
    <p className="text-lg font-bold text-primary dark:text-green">
      {offer.price.currency} {offer.price.total}
    </p>
    {offer.imageUrl && (
      <img
        src={offer.imageUrl}
        alt={offer.name}
        className="w-full h-24 object-cover rounded mt-2"
      />
    )}
  </div>
);
const AiActivityCard = ({ activity }: { activity: ActivityData }) => (
  <div className="max-w-md p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border mb-2">
    <h4 className="font-bold">{activity.title}</h4>
    <p className="text-xs text-gray-500 mb-2">{activity.description}</p>
    {activity.imageUrl && (
      <img
        src={activity.imageUrl}
        alt={activity.title}
        className="w-full h-24 object-cover rounded mt-2"
      />
    )}
  </div>
);
const AiItineraryCard = ({ itinerary }: { itinerary: ItineraryData }) => (
  <div className="max-w-md p-4 bg-green-100 dark:bg-green-900 rounded-lg border mb-2">
    <h4 className="font-bold">{itinerary.title}</h4>
    <ul className="text-xs text-gray-700 dark:text-gray-200 mt-2">
      {itinerary.days.map((day, idx) => (
        <li key={idx} className="mb-1">
          <span className="font-semibold">{day.date}:</span> {day.activities.join(", ")}
        </li>
      ))}
    </ul>
  </div>
);

interface ChatMessageProps {
  isAi: boolean;
  text?: string;
  timestamp: string;
  file?: { name: string; url: string; type?: string };
  audioUrl?: string;
  cardType?: "activity" | "flight" | "hotel" | "itinerary";
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
  const aiClasses =
    "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none";
  const userClasses = "bg-primary dark:bg-green text-white rounded-br-none";
  const alignment = isAi ? "justify-start" : "justify-end";
  const isImage = file?.type?.startsWith("image/");

  function isJson(text: string): boolean {
  text = text.trim();
  return text.startsWith('{') && text.endsWith('}');
}

  const renderContent = () => {
    if (cardType === "flight" && cardData) {
      // Support both single and multiple offers
      const offers = Array.isArray(cardData) ? cardData : cardData.offers || [cardData];
      return offers.map((o: FlightOffer) => (
        <AiFlightCard key={o.id} offer={o} onSelect={(id) => console.log("select", id)} />
      ));
    }
    if (cardType === "hotel" && cardData) {
      const hotels = Array.isArray(cardData) ? cardData : [cardData];
      return hotels.map((h: HotelOffer) => <AiHotelCard key={h.id} offer={h} />);
    }
    if (cardType === "activity" && cardData) {
      const activities = Array.isArray(cardData) ? cardData : [cardData];
      return activities.map((a: ActivityData) => <AiActivityCard key={a.id} activity={a} />);
    }
    if (cardType === "itinerary" && cardData) {
      const itineraries = Array.isArray(cardData) ? cardData : [cardData];
      return itineraries.map((it: ItineraryData) => <AiItineraryCard key={it.id} itinerary={it} />);
    } if (text) {
    if (isJson(text)) {
      try {
        const obj = JSON.parse(text);
        return (
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(obj, null, 2)}
          </pre>
        );
      } catch {}
    }
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    );
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
