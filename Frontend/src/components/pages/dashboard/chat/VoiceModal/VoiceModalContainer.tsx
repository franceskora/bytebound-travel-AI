import React, { useState, useEffect } from 'react'; // ⬅️ Add useEffect
import VoiceModal from './VoiceModal';
import { recordAudio } from '../../../../../utils/recordAudio';
import { summarizeVoiceConversation } from '../../../../../lib/api';

type VoiceModalContainerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  onAddAiMessage: (aiText: string) => Promise<void>;
  onVoiceSession: (audioBlob: Blob) => Promise<void>;
};

export const VoiceModalContainer: React.FC<VoiceModalContainerProps> = ({
  isOpen, onClose, onVoiceSession, onAddAiMessage
}) => {
  const [chunks, setChunks] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

const startSession = async () => {
  if (isListening) return; 
  setIsListening(true);
  const blob = await recordAudio();

  // Call the real voice session handler
  await onVoiceSession(blob);

  setIsListening(false);
};


  const finalizeSession = async () => {
    if (!chunks.length) return onClose();
    const summary = await summarizeVoiceConversation(chunks);
    onAddAiMessage(summary);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      setChunks([]); // ⬅️ Reset when modal closes
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // ⬅️ Runs only when isOpen changes

  return (
    <VoiceModal
      isOpen={isOpen}
      isListening={isListening}
      isSpeaking={false}
      onClose={() => { setIsListening(false); onClose(); }}
      onPause={() => {/* no-op or pause logic */}}
      onEnd={finalizeSession}
      transcript={chunks.join(' ')}
    />
  );
};

