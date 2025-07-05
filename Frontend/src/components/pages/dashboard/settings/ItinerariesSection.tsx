import { useState } from 'react';

interface Itinerary {
  id: number;
  title: string;
  date: string;
}

export const ItinerariesSection = () => {
  // Dummy itineraries
  const [itineraries] = useState<Itinerary[]>([
    { id: 1, title: 'Japan Summer Trip', date: '2025-07-10' },
    { id: 2, title: 'Business in Berlin', date: '2025-08-15' }
  ]);

  return (
    <div className="px-4 pb-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Manage your saved travel itineraries.
      </p>
      <ul className="space-y-2">
        {itineraries.map(itinerary => (
          <li
            key={itinerary.id}
            className="p-3 rounded-md border dark:bg-gray-700"
          >
            <p className="font-semibold">{itinerary.title}</p>
            <p className="text-xs text-gray-500">{itinerary.date}</p>
          </li>
        ))}
      </ul>
      <button className="w-full mt-4 bg-primary dark:bg-green text-white p-2 rounded-md">
        Create New Itinerary
      </button>
    </div>
  );
};