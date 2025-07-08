/// <reference types="vite/client" />
import axios from "axios";
import { ChatMessage, FlightOffer } from "./types";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Function to get the currently logged-in user's data
export const getCurrentUser = async () => {
  // We need to get the token, which is likely stored after login
  const token = localStorage.getItem('token'); 
  if (!token) throw new Error("No token found");

  const response = await API.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data.user;
};

// Function to log the user out
export const logoutUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    await API.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    // Remove the token from storage
    localStorage.removeItem('token');
};

// This function is currently a mock. Replace it with the code below.
export const registerUser = async ({
  name,
  email,
  password,
  role, // role is now accepted
}: {
  name: string;
  email: string;
  password: string;
  role: string; // type is now updated
}) => {
  // This now sends a request to your backend
  const response = await API.post('/auth/register', {
    name,
    email,
    password,
    role,
  });

  // Assuming the backend returns a token, store it
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data; // Return the full response from the backend
};

/**
 * Logs a user in by sending their credentials to the backend.
 * @param email The user's email address.
 * @param password The user's password.
 * @returns The data returned from the backend upon successful login.
 */
export const loginUser = async ({ email, password }: { email: string; password: string; }) => {
  // This sends a POST request to your backend's login endpoint
  const response = await API.post('/auth/login', {
    email,
    password,
  });

  // After a successful login, your backend should return a token.
  // We check for the token in the response data and save it to localStorage.
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  // Return the entire response data from the backend.
  return response.data;
};

/**
 * Creates a business profile for a partner user.
 * @param profileData - An object containing the business details.
 * @returns The data returned from the backend after profile creation.
 */
export const createPartnerProfile = async (profileData: { businessName: string; businessType: string; }) => {
  // Get the auth token from storage
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("Authorization token not found. Please log in.");
  }

  // Send a POST request to your backend's endpoint for creating a profile
  const response = await API.post('/partners/profile', profileData, {
    headers: {
      // Include the token in the request headers
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

//  AUDIO TRANSCRIPTION FUNCTION/**
//  * Transcribe an audio blob using your backend Whisper API.
//  * @param audioBlob The recorded audio blob
//  * @returns The transcribed text
//  */
export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await API.post("/transcribe", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; 
}

export const fetchActivities = async (dest: string) => {
  const res = await API.get(`/activities`, { params: { city: dest } });
  return res.data.activities; 
};

export const fetchFlightOffers = async (
  origin: string, destination: string,
  departureDate: string, returnDate?: string
): Promise<FlightOffer[]> => {
  const params: Record<string, any> = { origin, destination, departureDate, adults: 1 };
  if (returnDate) params.returnDate = returnDate;

  const { data } = await axios.get<{ offers: FlightOffer[] }>('/flight-booking', { params });
  console.log('fetchFlightOffers returned:', data);
  return data.offers;
};


export const fetchAiReply = async (
  messages: ChatMessage[],
  model = 'groq'
): Promise<string> => {
  const { data } =  await API.post('/ai-chat', { messages, model });
  return data.reply;
};

//Transcribe audio for voice session
export const transcribeAudioGroq = async (audio: Blob): Promise<string> => {
  const form = new FormData();
  form.append('audio', audio, 'voice.webm');
  const { data } = await API.post('/voice-transcribe', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.text;
};
// VOICE SESSiON SUMMARY
export const summarizeVoiceConversation = async (transcript: string[]): Promise<string> => {
  const { data } = await API.post('/ai-chat', {
    messages: transcript.map(t => ({ isAi: false, text: t })),
    model: 'groq',
    systemPrompt: 'Summarize key takeaways as bullet points.',
  });
  return data.reply;
};

export const fetchHotels = async (city: string, checkIn: string, checkOut: string) => {
  const res = await API.get(`/hotel-search`, { params: { city, checkIn, checkOut } });
  return res.data.hotels;
};

// =================================================================
// ===== START: I ADDED THIS NEW FUNCTION ==============================
// =================================================================

/**
 * Sends a user's request to the main backend orchestrator.
 * @param text The user's natural language input.
 * @param travelers An array of traveler objects.
 * @returns The complete trip details object from the backend.
 */
export const getOrchestratorResponse = async (text: string, travelers: any[]) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Not authorized. Please log in.");

  // This calls your main backend endpoint for orchestrating the trip
  const response = await API.post('/flight-booking', { text, travelers }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};
