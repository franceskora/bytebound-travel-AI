// AiFlightCard.tsx
import { Plane, ArrowRight } from "lucide-react";
import { Button } from "../../../ui/button";
import { FlightOffer } from "../../../../lib/types";

export const AiFlightCard = ({
  offer,
  onSelect
}: {
  offer: FlightOffer;
  onSelect: (id: string) => void;
}) => {
  const seg1 = offer.itineraries[0]?.segments[0];
  return (
    <div className="flex justify-start">
      <div className="max-w-md p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border">
        <p className="text-sm mb-3 dark:text-gray-300">Here's a flight for you:</p>
        <div className="bg-white dark:bg-dark p-4 rounded shadow">
          <div className="flex justify-between text-xs mb-2">
            <span>{seg1.airline}</span>
            <span>
              {offer.flightType === 'round-trip' ? 'Round Trip' : 'One Way'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <p className="font-bold">{seg1.origin}</p>
              <p className="text-xs text-gray-500">
                {new Date(seg1.departure).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
              </p>
            </div>
            <Plane size={16} className="mx-2 text-gray-400" />
            <ArrowRight size={16} className="text-gray-400" />
            <div className="flex flex-col items-center">
              <p className="font-bold">{seg1.destination}</p>
              <p className="text-xs text-gray-500">
                {new Date(seg1.arrival).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
              </p>
            </div>
          </div>
          <div className="border-t border-dashed my-3 border-gray-300 dark:border-gray-600"></div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-primary dark:text-green">
              {offer.price.currency} {offer.price.total}
            </p>
            <Button onClick={() => onSelect(offer.id)} className="h-8 text-xs bg-primary dark:bg-green">
              Select Flight
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
