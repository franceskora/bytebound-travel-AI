// hooks/useTextToSpeech.ts
export const useTextToSpeech = () => {
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    if (synth) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      synth.speak(utter);
    }
  };

  return { speak };
};