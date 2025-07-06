import { Star } from "lucide-react";
// This is the corrected import path
import { Button } from "../../../ui/button";

export const AiHotelCard = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-sm p-4 bg-gray-100 dark:bg-gray-800 rounded-lg rounded-bl-none border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Based on your request, I think you'll love this hotel:
        </p>
        <div className="bg-white dark:bg-dark rounded-lg shadow-md overflow-hidden">
          <img
            src="/path/to/hotel-image.png" // The JS dev will replace this with a real image URL
            alt="Hotel Exterior"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-lg">Le Grand Hôtel du Palais Royal</h3>
            <div className="flex items-center my-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <Star size={16} className="text-gray-300 dark:text-gray-600" />
              <span className="text-xs text-gray-500 ml-2">(4.5 Stars)</span>
            </div>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-xs text-gray-500">from</p>
                <p className="text-xl font-bold text-primary dark:text-green">$250</p>
                <p className="text-xs text-gray-500">/ night</p>
              </div>
              <Button className="h-9 text-sm bg-primary dark:bg-green">Select Hotel</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};