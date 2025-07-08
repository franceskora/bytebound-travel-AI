import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure you have react-router-dom installed
import { Button } from '../../components/ui/button';
import { createPartnerProfile } from '../../lib/api'; // Adjust this import path to your api.ts file

export const CreatePartnerProfile = () => {
  // 1. Add state to manage form inputs and loading status
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('hotel'); // Default to 'hotel'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 2. Create the function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true);
    setError(null);

    try {
      // Call the API function you created earlier
      await createPartnerProfile({ businessName, businessType });

      // 3. On success, navigate to the partner dashboard
      navigate('/partner-dashboard');

    } catch (err) {
      console.error("Failed to create partner profile:", err);
      setError("Failed to create profile. Please try again."); // Set an error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, Partner!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Let's set up your business profile.</p>
        </div>

        {/* 4. Connect the handleSubmit function to the form's onSubmit event */}
        <form onSubmit={handleSubmit}>
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
                value={businessName} // 5. Link input value to state
                onChange={(e) => setBusinessName(e.target.value)} // 6. Update state on change
                required // Make the field required
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
                value={businessType} // Link select value to state
                onChange={(e) => setBusinessType(e.target.value)} // Update state on change
              >
                <option value="hotel">Hotel</option>
                <option value="airline">Airline</option>
                <option value="tour_operator">Tour Operator</option>
              </select>
            </div>
          </div>
          
          {/* Display error message if any */}
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

          <div className="mt-8">
            <Button type="submit" className="w-full bg-primary dark:bg-green text-white font-bold" disabled={isLoading}>
              {/* Show loading text when submitting */}
              {isLoading ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreatePartnerProfile;