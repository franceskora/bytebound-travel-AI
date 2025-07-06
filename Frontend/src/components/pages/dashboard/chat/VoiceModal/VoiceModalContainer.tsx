// components/VoiceModalContainer.tsx
import React, { useState } from "react";
import VoiceModal from "./VoiceModal";
import { useSpeechToText } from "../../../../../hooks/useSpeechToText";
import { useTextToSpeech } from "../../../../../utils/tts";

type VoiceModalContainerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
};

export const VoiceModalContainer: React.FC<VoiceModalContainerProps> = ({
  isOpen,
  onClose,
  onSend,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const {
    transcript,
    listening,
    startListening,
    stopListening,
  } = useSpeechToText();

  const { speak } = useTextToSpeech();

  const handlePause = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleEnd = () => {
    stopListening();
    if (transcript.trim()) {
      onSend(transcript);
      // Optionally, speak a response:
      setIsSpeaking(true);
      speak("This is how to pronounce it!");
      setTimeout(() => setIsSpeaking(false), 2000);
    }
    onClose();
  };

  return (
    <VoiceModal
      isOpen={isOpen}
      isListening={listening}
      isSpeaking={isSpeaking}
      onClose={() => {
        stopListening();
        onClose();
      }}
      onPause={handlePause}
      onEnd={handleEnd}
      transcript={transcript}
    />
  );
};