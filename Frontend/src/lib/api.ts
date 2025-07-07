/// <reference types="vite/client" />
import axios from "axios";
import { ChatMessage, FlightOffer } from "./types";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Simulate a user registration
export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return fake user data
  return {
    id: "fake_user_id_123",
    name,
    email,
    password, // Include password to use the variable
    token: "fake_jwt_token",
  };
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


export const fetchHotels = async (city: string, checkIn: string, checkOut: string) => {
  const res = await API.get(`/hotel-search`, { params: { city, checkIn, checkOut } });
  return res.data.hotels;
};