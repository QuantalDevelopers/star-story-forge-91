
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, X } from 'lucide-react';
import { toast } from 'sonner';

type ElevenLabsConversationProps = {
  type: 'delivery' | 'star' | 'scratch';
  onClose: () => void;
};

const ElevenLabsConversation: React.FC<ElevenLabsConversationProps> = ({ type, onClose }) => {
  const [status, setStatus] = useState<'disconnected' | 'connected'>('disconnected');
  const [mode, setMode] = useState<'listening' | 'speaking'>('listening');
  const conversationRef = useRef<any>(null);
  const [conversationModule, setConversationModule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamically import the @11labs/client package to avoid SSR issues
  useEffect(() => {
    const loadElevenLabsClient = async () => {
      try {
        const module = await import('@11labs/client');
        setConversationModule(module);
      } catch (err) {
        console.error("Failed to load ElevenLabs client:", err);
        toast.error("Failed to load ElevenLabs client");
      }
    };
    
    loadElevenLabsClient();
  }, []);

  const getTitle = () => {
    switch(type) {
      case 'delivery': return 'Delivery Companion';
      case 'star': return 'STAR Method Companion';
      case 'scratch': return 'Start From Scratch';
    }
  };

  const getPrompt = () => {
    switch(type) {
      case 'delivery': 
        return "You are an interview coach helping the user practice their interview delivery. Give constructive feedback on their speaking style, clarity, and confidence.";
      case 'star':
        return "You are an interview coach helping the user structure their interview responses using the STAR method (Situation, Task, Action, Result). Guide them through creating effective stories using this framework.";
      case 'scratch':
        return "You are an interview coach helping the user create new interview stories from scratch. Help them identify relevant experiences and structure them effectively for interviews.";
    }
  };

  const startConversation = async () => {
    try {
      setIsLoading(true);
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!conversationModule) {
        toast.error("ElevenLabs client not loaded yet. Please try again in a moment.");
        setIsLoading(false);
        return;
      }

      console.log("Starting conversation with prompt:", getPrompt());

      // Start the conversation with proper error handling
      const conversation = await conversationModule.Conversation.startSession({
        agentId: '23g4tA9QfQmk5A2msRMO', // ElevenLabs Interview Coach agent ID
        overrides: {
          agent: {
            prompt: {
              prompt: getPrompt(),
            },
          },
        },
        onConnect: () => {
          console.log("Conversation connected successfully");
          setStatus('connected');
          toast.success(`${getTitle()} connected`);
          setIsLoading(false);
        },
        onDisconnect: () => {
          console.log("Conversation disconnected");
          setStatus('disconnected');
          toast.info(`${getTitle()} disconnected`);
          setIsLoading(false);
        },
        onError: (error: any) => {
          console.error('Conversation error:', error);
          toast.error(`Error: ${error.message || 'Unknown error'}`);
          setIsLoading(false);
        },
        onModeChange: (modeInfo: any) => {
          console.log("Mode changed to:", modeInfo.mode);
          setMode(modeInfo.mode === 'speaking' ? 'speaking' : 'listening');
        },
        onMessage: (message: any) => {
          console.log("Received message:", message);
        }
      });
      
      conversationRef.current = conversation;
      console.log("Conversation reference set:", conversationRef.current);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error(`Failed to start conversation: ${(error as Error).message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const stopConversation = async () => {
    if (conversationRef.current) {
      try {
        console.log("Ending conversation session");
        await conversationRef.current.endSession();
        console.log("Conversation ended successfully");
        conversationRef.current = null;
      } catch (error) {
        console.error('Failed to end conversation:', error);
        toast.error(`Failed to end conversation: ${(error as Error).message || 'Unknown error'}`);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        console.log("Component unmounting, cleaning up conversation");
        stopConversation();
      }
    };
  }, []);

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-4">
          <Button 
            onClick={startConversation} 
            disabled={status === 'connected' || isLoading}
            className="px-6"
          >
            {isLoading ? 'Connecting...' : 'Start Conversation'}
          </Button>
          <Button 
            onClick={stopConversation} 
            disabled={status === 'disconnected'}
            variant="outline"
            className="px-6"
          >
            Stop Conversation
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3 bg-accent/20 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <p>Status: <span className="font-medium">{status === 'connected' ? 'Connected' : 'Disconnected'}</span></p>
          </div>
          
          <div className="flex items-center gap-2">
            {mode === 'speaking' ? (
              <div className="text-indigo-600 animate-pulse">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <Mic size={18} className="text-indigo-600" />
            )}
            <p>Agent is <span className="font-medium">{mode}</span></p>
          </div>
        </div>

        <div className="text-sm text-center text-muted-foreground">
          {status === 'disconnected' ? (
            <p>Click "Start Conversation" to begin speaking with your AI companion.</p>
          ) : (
            <p>Your AI companion is {mode}. {mode === 'listening' ? 'You can speak now.' : 'Please wait while the AI responds.'}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ElevenLabsConversation;
