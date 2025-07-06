import { useState } from 'react';

export const useTextToSpeech = () => {
  const [speaking, setSpeaking] = useState(false);

  const speak = (text: string, lang = 'en-US') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return { speak, speaking };
};
