
import React from "react";
import { useState } from "react";
import { X, Pause, Square, Play } from "lucide-react";


type VoiceModalProps = {
  isOpen: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onClose: () => void;
  onPause: () => void;
  onEnd: () => void;
  transcript?: string;
};



export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  isListening,
  isSpeaking,
  onClose,
  onPause,
  onEnd,
  transcript = "",
}) => {
  const [paused, setPaused] = useState(false);

  if (!isOpen) return null;

  const handlePauseResume = () => {
    setPaused((prev) => !prev);
    onPause();
  };

  return (
    <div className="voice-modal-overlay">
      <div className="voice-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="mic-container">
          <div className={`neon-mic ${isSpeaking ? "speaking" : ""}`} />
          <div className="sound-wave">
            {/* Placeholder: swap with real animated waves */}
            <div className={`wave-bar ${isSpeaking ? "active" : ""}`} />
            <div className={`wave-bar ${isSpeaking ? "active" : ""}`} />
            <div className={`wave-bar ${isSpeaking ? "active" : ""}`} />
            <div className={`wave-bar ${isSpeaking ? "active" : ""}`} />
          </div>
        </div>

        <div className="transcript">
          {isListening && !paused ? (
            <p className="listening-text">Listening...</p>
          ) : (
            <p>{transcript}</p>
          )}
        </div>

        <div className="controls">
          <button
            className="btn pause"
            onClick={handlePauseResume}
          >
            <>
              {paused ? <Pause size={18} /> : <Play size={18} />}
              {paused ? "Resume" : "Pause"}
            </>
          </button>
          <button className="btn end" onClick={onEnd}>
            <Square size={18} />
            End
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;