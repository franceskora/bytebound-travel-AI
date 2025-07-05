import { useState } from 'react';
import { budgetRanges } from '../../../../data/chat';

export const BudgetPreferencesSection = () => {
  const [selectedRange, setSelectedRange] = useState<string>('');
  const [tripType, setTripType] = useState<'domestic' | 'international'>('international');

 

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Budget Preferences</h3>
      <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
        Select your average spending range for trips. This will help us tailor recommendations to your budget.
      </p>

      <div className="space-y-2">
        {budgetRanges.map((range) => (
          <label
            key={range.label}
            className={`flex items-center p-2 border rounded-lg cursor-pointer ${
              selectedRange === range.label
                ? 'border-primary bg-primary dark:border-green dark:bg-green'
                : 'border-gray-300 dark:border-gray-600 bg-secondary dark:bg-secondary'
            }`}
          >
            <input
              type="radio"
              name="budget"
              value={range.label}
              checked={selectedRange === range.label}
              onChange={() => setSelectedRange(range.label)}
              className="mr-2 bg-secondary dark:bg-secondary"
            />
            <div>
              <span className="font-semibold">{range.label}</span>
              <span className="ml-2 text-sm">
                {range.range.min} - {range.range.max}
              </span>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-md font-bold mb-2">Preferred Trip Type</h4>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg border ${
              tripType === 'domestic'
                ? 'border-primary bg-primary dark:border-green dark:bg-green'
                : 'border-gray-300 dark:border-gray-600 bg-secondary dark:bg-secondary'
            }`}
            onClick={() => setTripType('domestic')}
          >
            Domestic
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${
              tripType === 'international'
                ? 'border-primary bg-primary dark:border-green dark:bg-green'
                : 'border-gray-300 dark:border-gray-600 bg-secondary dark:bg-secondary'
            }`}
            onClick={() => setTripType('international')}
          >
            International
          </button>
        </div>
      </div>
    </div>
  );
};