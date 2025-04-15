
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, X } from 'lucide-react';
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';

type ElevenLabsConversationProps = {
  type: 'delivery' | 'star' | 'scratch';
  onClose: () => void;
};

const ElevenLabsConversation: React.FC<ElevenLabsConversationProps> = ({ type, onClose }) => {
  const { 
    status, 
    mode, 
    isLoading, 
    startConversation, 
    stopConversation 
  } = useElevenLabsConversation(type);

  const getTitle = () => {
    switch(type) {
      case 'delivery': return 'Delivery Companion';
      case 'star': return 'STAR Method Companion';
      case 'scratch': return 'Start From Scratch';
    }
  };

  const handleCircleClick = () => {
    if (status === 'connected') {
      stopConversation();
    } else if (!isLoading) {
      startConversation();
    }
  };

  // Get color based on companion type
  const getColor = () => {
    switch(type) {
      case 'delivery': return 'bg-blue-500 hover:bg-blue-600';
      case 'star': return 'bg-indigo-500 hover:bg-indigo-600';
      case 'scratch': return 'bg-pink-500 hover:bg-pink-600';
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      {/* Main circular interface */}
      <div 
        className={`relative w-40 h-40 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg
          ${status === 'connected' ? 'animate-pulse ' + getColor() : isLoading ? 'bg-gray-400' : getColor()}`}
        onClick={handleCircleClick}
      >
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          {status === 'connected' ? (
            <div className="text-white">
              {mode === 'speaking' ? (
                <div className="animate-pulse">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : (
                <Mic size={48} />
              )}
            </div>
          ) : (
            <div className="text-white">
              {isLoading ? (
                <div className="animate-spin">
                  <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <Mic size={48} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status text */}
      <div className="mt-6 text-center">
        <p className="font-medium text-lg">
          {isLoading ? 'Connecting...' : status === 'connected' ? 
            `Agent is ${mode}` : 
            'Tap to start conversation'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {status === 'connected' && mode === 'listening' && 'You can speak now'}
          {status === 'connected' && mode === 'speaking' && 'Please wait while the AI responds'}
        </p>
      </div>
    </div>
  );
};

export default ElevenLabsConversation;
