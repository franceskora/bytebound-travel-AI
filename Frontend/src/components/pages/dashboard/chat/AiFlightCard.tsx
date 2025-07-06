import { Plane, ArrowRight } from "lucide-react";
// This is the corrected path based on your folder structure
import { Button } from "../../../ui/button"; 

export const AiFlightCard = () => {
  // The rest of your component code remains exactly the same.
  // ...
  return (
    <div className="flex justify-start">
      <div className="max-w-md p-4 bg-gray-100 dark:bg-gray-800 rounded-lg rounded-bl-none border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          I found a few great flight options for your trip. Here is the best one based on your preferences:
        </p>
        <div className="bg-white dark:bg-dark p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">American Airlines</span>
            <span className="text-xs font-semibold text-primary dark:text-green">Round Trip</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <p className="font-bold text-xl">JFK</p>
              <p className="text-xs text-gray-500">10:30 AM</p>
            </div>
            <div className="flex items-center text-gray-400">
              <Plane size={16} className="mx-2"/>
              <ArrowRight size={16} />
            </div>
            <div className="flex flex-col items-center">
              <p className="font-bold text-xl">CDG</p>
              <p className="text-xs text-gray-500">11:00 PM</p>
            </div>
          </div>
          <div className="border-t border-dashed my-3 border-gray-300 dark:border-gray-600"></div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary dark:text-green">$950.00</p>
            <Button className="h-8 text-xs bg-primary dark:bg-green">Select Flight</Button>
          </div>
        </div>
      </div>
    </div>
  );
};