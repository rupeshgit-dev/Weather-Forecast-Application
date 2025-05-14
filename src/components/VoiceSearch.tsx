import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff } from 'lucide-react';

interface VoiceSearchProps {
  onVoiceInput: (text: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onVoiceInput }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      onVoiceInput(transcript);
      resetTranscript();
    }
  }, [transcript, onVoiceInput, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <button
      onClick={() => SpeechRecognition.startListening()}
      disabled={listening}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm
                text-gray-800 shadow-lg hover:bg-white/100 transition-all duration-300
                disabled:opacity-70 disabled:cursor-not-allowed"
      aria-label="Voice search"
    >
      {listening ? (
        <MicOff size={20} className="text-red-500 animate-pulse" />
      ) : (
        <Mic size={20} />
      )}
    </button>
  );
};

export default VoiceSearch;