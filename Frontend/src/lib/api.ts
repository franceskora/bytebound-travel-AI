import axios from "axios";

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