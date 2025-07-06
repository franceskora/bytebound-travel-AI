// src/utils/stt.ts

export type SpeechCallbacks = {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
};

export const createSpeechRecognition = (callbacks: SpeechCallbacks) => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    callbacks.onStart?.();
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const raw = event.results[0][0].transcript.trim();
    const polished =
      raw.charAt(0).toUpperCase() + raw.slice(1) + ".";
    callbacks.onResult(polished);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error("Speech recognition error", event.error);
    callbacks.onError?.(event.error);
  };

  recognition.onend = () => {
    callbacks.onEnd?.();
  };

  return recognition;
};
