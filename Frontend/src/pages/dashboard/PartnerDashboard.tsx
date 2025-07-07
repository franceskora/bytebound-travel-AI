import { BarChart, Users, DollarSign, Activity } from 'lucide-react';

export const PartnerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* === Header === */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Partner Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome, The Landmark Hotel!</p>
        </div>

        {/* === Key Stats Cards === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">$12,450</p>
            </div>
            <div className="bg-green/20 text-green p-3 rounded-full">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</p>
              <p className="text-3xl font-bold mt-1">82</p>
            </div>
            <div className="bg-primary/20 text-primary p-3 rounded-full">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Search Appearances</p>
              <p className="text-3xl font-bold mt-1">1,204</p>
            </div>
            <div className="bg-yellow-400/20 text-yellow-500 p-3 rounded-full">
              <BarChart className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Rating</p>
              <p className="text-3xl font-bold mt-1">4.8 / 5</p>
            </div>
            <div className="bg-pink-500/20 text-pink-500 p-3 rounded-full">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* === Placeholder for a Chart === */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
           <h3 className="text-lg font-semibold mb-4">Bookings Over Time</h3>
           <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
             <p className="text-gray-400">Chart will be displayed here</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PartnerDashboard;