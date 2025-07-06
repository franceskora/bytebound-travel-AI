import { ArrowRight } from "lucide-react";
// This is the corrected import path
import { Button } from "../../../ui/button";

export const AiActivityCard = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-xs p-4 bg-gray-100 dark:bg-gray-800 rounded-lg rounded-bl-none border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Here is a popular activity at your destination:
        </p>
        <div className="bg-white dark:bg-dark rounded-lg shadow-md overflow-hidden">
          <img
            src="/path/to/activity-image.png" // The JS dev will replace this
            alt="Eiffel Tower"
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <h4 className="font-bold">Eiffel Tower Summit Visit</h4>
            <p className="text-xs text-gray-500 mt-1 mb-3">
              Get breathtaking views of Paris from the very top of the iconic Eiffel Tower.
            </p>
            <Button variant="outline" className="w-full h-8 text-xs border-primary text-primary hover:bg-primary/10 dark:border-green dark:text-green dark:hover:bg-green/10">
              Learn More <ArrowRight className="ml-2" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};