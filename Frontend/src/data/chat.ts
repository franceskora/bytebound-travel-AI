// data/chats.ts

export interface UserChat {
  id: number;
  title: string;
}

export interface ChatMessage {
  id: number;
  isAi: boolean;
  text?: string;
  imageUrl?: string;
   timestamp?: string;
  file?: {
    name: string;
    url: string;
  };
}

export interface UserChat {
  id: number;
  title: string;
  messages: ChatMessage[];
}

export const chats: UserChat[] = [
  {
    id: 1,
    title: 'Weekend Trip to Paris',
    messages: [
      {
        id: 1,
        isAi: true,
        text: "Bonjour! How can I help plan your Paris trip?",
        timestamp: "2025-06-30T10:30:00Z",
      },
      {
        id: 2,
        isAi: false,
        text: "Here’s a photo. Where is this?",
        imageUrl: "/eiffel-tower.jpg",
         timestamp: "2025-06-30T10:31:00Z",
      },
    ],
  },
  {
    id: 2,
    title: 'Booking flight to Lagos for July',
    messages: [
      {
        id: 1,
        isAi: true,
        text: "When do you want to fly to Lagos?",
        timestamp: "2025-06-30T12:27:00Z",
      },
      {
        id: 2,
        isAi: false,
        text: "July 15th, return July 20th.",
        timestamp: "2025-06-30T12:27:00Z",
      },
    ],
  },
  {
    id: 3,
    title: 'Find best pizza places in Rome',
    messages: [
      {
        id: 1,
        isAi: true,
        text: "Let’s find the top pizza spots for you!",
        timestamp: "2025-06-29T11:31:00Z",
      },
    ],
  },
];

// Frontend/src/data/budgetPreferences.ts

export const budgetRanges = [
  { label: 'Adventurer', range: {min: 2000, max: 3000} },
  { label: 'Explorer', range:{min: 3500, max: 5000} },
  { label: 'Business', range: {min: 5000, max: 8000} },
  { label: 'Luxury',range: { min: 8000, max: 12000} },
];

// src/data/user.ts
export const userProfile = {
  name: "Jane Doe",
  email: "jane@example.com",
  profilePicture: null,
  budgetPreference: {
    label: "Adventurer",
    range: { min: 2000, max: 3000 }
  },
  tripType: "International"
};