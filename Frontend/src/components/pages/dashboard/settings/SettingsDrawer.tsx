import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { ProfileSection } from './ProfileSection';
import { VoicePreferencesSection } from './VoicePreferencesSection';
import { ItinerariesSection } from './ItinerariesSection';
import { LessonsSection } from './LessonsSection';
import { BudgetPreferencesSection } from './BudgetPreferencesSection';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  if (!isOpen) return null;

  const [openSection, setOpenSection] = useState<string | null>('profile');
  const toggleSection = (section: string) => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-opacity-50" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-dark h-full shadow-xl p-6 overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-light dark:bg-dark hover:bg-gray-100 dark:hover:bg-gray-700">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        <div className="space-y-4">
          {/* Profile Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              className="w-full flex justify-between items-center p-4 bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              onClick={() => toggleSection('profile')}
            >
              <span className="font-semibold">Profile</span>
              {openSection === 'profile' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'profile' && <ProfileSection />}
          </div>

          {/* Voice */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              className="w-full flex justify-between items-center p-4 bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              onClick={() => toggleSection('voice')}
            >
              <span className="font-semibold">Voice Preferences</span>
              {openSection === 'voice' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'voice' && <VoicePreferencesSection />}
          </div>

          {/* Itineraries */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              className="w-full flex justify-between items-center p-4 bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              onClick={() => toggleSection('itineraries')}
            >
              <span className="font-semibold">Itineraries</span>
              {openSection === 'itineraries' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'itineraries' && <ItinerariesSection />}
          </div>

          {/* Lessons */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              className="w-full flex justify-between items-center p-4 bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              onClick={() => toggleSection('lessons')}
            >
              <span className="font-semibold">Language Lessons</span>
              {openSection === 'lessons' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'lessons' && <LessonsSection />}
          </div>

          {/* Budget Preferences */}
<div className="border border-gray-200 dark:border-gray-700 rounded-lg">
  <button
    className="w-full flex justify-between items-center p-4 bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
    onClick={() => toggleSection('budget')}
  >
    <span className="font-semibold">Budget Preferences</span>
    {openSection === 'budget' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>
  {openSection === 'budget' && <BudgetPreferencesSection />}
</div>
        </div>
      </div>
    </div>
  );
};