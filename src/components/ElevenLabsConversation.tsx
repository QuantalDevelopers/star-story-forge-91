
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, X } from 'lucide-react';
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
    isModuleLoaded,
    startConversation, 
    stopConversation 
  } = useElevenLabsConversation(type);

  const getTitle = () => {
    switch(type) {
      case 'delivery': return 'Voice Design';
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
        className={`relative w-64 h-64 rounded-full flex items-center justify-center ${!isLoading && isModuleLoaded ? "cursor-pointer transition-all duration-300" : ""}`}
        style={{
          background: "url('public/lovable-uploads/2066d0db-b75d-41b0-a9c1-9beb662e81df.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        onClick={isModuleLoaded && !isLoading ? handleCircleClick : undefined}
      >
        <div className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md w-56 h-56 rounded-full flex items-center justify-center border border-white/20">
            {!isModuleLoaded ? (
              <div className="text-white flex flex-col items-center">
                <div className="animate-spin mb-2">
                  <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <span className="text-sm">Loading ElevenLabs...</span>
              </div>
            ) : isLoading ? (
              <div className="text-white flex flex-col items-center">
                <div className="animate-spin mb-2">
                  <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <span className="text-sm">Connecting...</span>
              </div>
            ) : status === 'connected' ? (
              <div className={`text-white ${mode === 'speaking' ? 'animate-pulse' : ''}`}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <div className="text-white flex flex-col items-center">
                <Mic size={48} strokeWidth={1.5} />
                <span className="text-sm mt-2">Try a call</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="mt-6 text-center">
        <p className="font-medium">
          {!isModuleLoaded 
            ? 'Loading ElevenLabs...' 
            : status === 'connected' 
              ? `Agent is ${mode === 'speaking' ? 'speaking' : 'listening'}` 
              : isLoading ? 'Connecting...' : 'Tap to start a conversation'}
        </p>
      </div>
    </div>
  );
};

export default ElevenLabsConversation;
