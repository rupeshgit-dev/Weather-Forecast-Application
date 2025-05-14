import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center gap-2 bg-red-500/20 backdrop-blur-sm
                    text-white rounded-lg p-4 mt-6 animate-fade-in max-w-md mx-auto">
      <AlertCircle size={24} className="text-red-200" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;