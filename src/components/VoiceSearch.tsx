import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff } from 'lucide-react';

interface VoiceSearchProps {
  onVoiceInput: (text: string) => void;
  disabled?: boolean;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onVoiceInput, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    clearTranscriptOnListen: true,
  });

  React.useEffect(() => {
    if (transcript) {
      onVoiceInput(transcript);
      resetTranscript();
      setIsListening(false);
      SpeechRecognition.stopListening();
    }
  }, [transcript, onVoiceInput, resetTranscript]);

  // Sync internal state with actual listening state
  React.useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: false });
      setIsListening(true);
    }
  };

  // Handle cleanup when component unmounts
  React.useEffect(() => {
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm
                transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                ${isListening 
                  ? 'bg-red-500/90 hover:bg-red-600/90' 
                  : 'bg-white/90 hover:bg-white/100'}`}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
    >
      {isListening ? (
        <MicOff size={20} className="text-white animate-pulse" />
      ) : (
        <Mic size={20} className="text-gray-800" />
      )}
    </button>
  );
};

export default VoiceSearch;