import { Button } from '../../components/ui/button';

export const CreatePartnerProfile = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, Partner!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Let's set up your business profile.</p>
        </div>

        <form>
          <div className="space-y-6">
            
            {/* Business Name Input */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Business Name
              </label>
              <input
                id="businessName"
                type="text"
                placeholder="e.g., The Landmark Hotel"
                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              />
               <p className="text-xs text-gray-400 mt-1">This must exactly match the name on Amadeus.</p>
            </div>

            {/* Business Type Dropdown */}
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Business Type
              </label>
              <select
                id="businessType"
                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              >
                <option value="hotel">Hotel</option>
                <option value="airline">Airline</option>
                <option value="tour_operator">Tour Operator</option>
              </select>
            </div>

          </div>
          
          <div className="mt-8">
            <Button type="submit" className="w-full bg-primary dark:bg-green text-white font-bold">
              Create Profile
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreatePartnerProfile;