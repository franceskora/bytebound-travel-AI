import { useState } from 'react';

export const VoicePreferencesSection = () => {
  const [language, setLanguage] = useState('English');
  const [voice, setVoice] = useState('Default');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Language:', language);
    console.log('Voice:', voice);
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Customize the voice and language used for AI interactions.
      </p>

      <label className="block mb-2 text-sm font-medium">Preferred Language</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full mb-4 p-2 rounded-md border bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <option>English</option>
        <option>Spanish</option>
        <option>French</option>
        <option>Japanese</option>
      </select>

      <label className="block mb-2 text-sm font-medium">Voice Style</label>
      <select
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        className="w-full mb-4 p-2 rounded-md border bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <option>Default</option>
        <option>Casual</option>
        <option>Formal</option>
        <option>Childlike</option>
      </select>

      <button
        type="submit"
        className="w-full mt-2 bg-primary dark:bg-green text-white p-2 rounded-md"
      >
        Save Preferences
      </button>
    </form>
  );
};