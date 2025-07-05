import { useEffect, useState, useCallback } from 'react';


export const useSpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

 useEffect(() => {
  if (!recognition) return;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const results = event.results;

    let interimTranscript = '';
    for (let i = event.resultIndex; i < results.length; ++i) {
      interimTranscript += results[i][0].transcript;
    }

    setTranscript(interimTranscript);
  };

  recognition.onend = () => {
    if (listening) recognition.start();
  };
}, [recognition, listening]);


  const startListening = useCallback(() => {
    if (!recognition) return;
    setListening(true);
    recognition.start();
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    setListening(false);
    recognition.stop();
  }, [recognition]);

  return { transcript, listening, startListening, stopListening };
};