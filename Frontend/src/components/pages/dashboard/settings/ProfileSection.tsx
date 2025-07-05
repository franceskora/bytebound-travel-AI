import { useState } from 'react';
import { userProfile } from '../../../../data/chat';
import { COUNTRY_CODES } from '../../../../data/countryCodes';

export const ProfileSection = () => {
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      email,
      phone: `${countryCode} ${phoneNumber}`,
      profilePic,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-4 w-full max-w-full overflow-x-hidden">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Update your name, email, phone number, and profile picture.
      </p>

      {/* Name */}
      <label className="block mb-2 text-sm font-medium">Display Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 p-2 rounded-md border bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      />

      {/* Email */}
      <label className="block mb-2 text-sm font-medium">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 p-2 rounded-md border bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      />
{/* Phone */}
     <label className="block mb-2 text-sm font-medium">Phone Number</label>
<div className="flex flex-wrap gap-2 mb-4 w-full">
  <select
    value={countryCode}
    onChange={(e) => setCountryCode(e.target.value)}
    className="w-full sm:w-auto p-2 rounded-md border bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    {COUNTRY_CODES.map((c) => (
      <option key={c.code} value={c.code}>
        {c.label} {c.code}
      </option>
    ))}
  </select>
  <input
    type="tel"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    placeholder="234 567 8901"
    className="flex-1 min-w-0 p-2 rounded-md border bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
  />
</div>


      {/* Profile Picture */}
      <label className="block mb-2 text-sm font-medium">Profile Picture</label>
      <div className="border-2 border-dashed rounded-lg p-4 text-center dark:border-gray-600 bg-light dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 w-full overflow-hidden">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm mb-2"
        />
        {profilePic && (
          <p className="text-xs text-green-600 dark:text-green-400 break-words">
            Selected: {profilePic.name}
          </p>
        )}
      </div>

      {/* Budget Section */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-md font-bold mb-2">Budget Preference</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Label:</strong> {userProfile.budgetPreference.label}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Range:</strong> ${userProfile.budgetPreference.range.min} - ${userProfile.budgetPreference.range.max}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Trip Type:</strong> {userProfile.tripType}
        </p>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-primary dark:bg-green text-white p-2 rounded-md"
      >
        Save Profile
      </button>
    </form>
  );
};