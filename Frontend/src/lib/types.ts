import * as z from "zod";


export interface UserChat {
  id: number;
  title: string;
}

export interface ChatMessage {
  id: number;
  isAi: boolean;
  text?: string;
  imageUrl?: string;
   timestamp: string;
  file?: {
    name: string;
    url: string;
   
  };
   cardType?: "activity" | "flight" | "hotel" | "itinerary"; 
  cardData?: FlightOffer | HotelOffer | ActivityData | ItineraryData | any;
}

export interface UserChat {
  id: number;
  title: string;
  messages: ChatMessage[];
}

export interface FlightOffer {
  id: string;
  price: { total: string; currency: string };
  flightType: string;
  itineraries: {
    segments: {
      airline: string;
      origin: string;
      destination: string;
      departure: string;
      arrival: string;
      flightNumber: string;
    }[];
  }[];
}

export interface ActivityData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location?: string;
}

export interface HotelOffer {
  id: string;
  name: string;
  price: { total: string; currency: string };
  address: string;
  imageUrl?: string;
  rating?: number;
}

export interface ItineraryData {
  id: string;
  title: string;
  days: Array<{
    date: string;
    activities: string[];
  }>;
}


export const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof signupSchema>;