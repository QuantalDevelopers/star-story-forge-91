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
  const [apiKey, setApiKey] = useState<string | null>(null);

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
    
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/elevenlabs-key');
        const data = await response.json();
        setApiKey(data.apiKey);
      } catch (error) {
        console.error("Failed to fetch ElevenLabs API key:", error);
        toast.error("Failed to retrieve API key");
      }
    };

    loadElevenLabsClient();
    fetchApiKey();
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
    if (!apiKey) {
      toast.error("ElevenLabs API key is missing. Please configure it in your project settings.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!conversationModule) {
        toast.error("ElevenLabs client not loaded yet. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("Starting conversation with prompt:", getPrompt());
      console.log("Using Agent ID:", '23g4tA9QfQmk5A2msRMO');
      console.log("Attempting to connect...");

      const conversation = await conversationModule.Conversation.startSession({
        apiKey: apiKey,
        agentId: '23g4tA9QfQmk5A2msRMO',
        overrides: { /* ... */ },
        onConnect: () => {
          console.log("onConnect triggered");
          setStatus('connected');
          toast.success(`${getTitle()} connected`);
          setIsLoading(false);
        },
        onDisconnect: (reason?: string) => {
          console.error("onDisconnect triggered. Reason:", reason || 'No reason provided');
          setStatus('disconnected');
          if (conversationRef.current) {
               toast.info(`${getTitle()} disconnected unexpectedly.`);
          }
          setIsLoading(false);
          conversationRef.current = null;
        },
        onError: (error: any) => {
          console.error('onError triggered:', error);
          const errorMessage = error?.message || (typeof error === 'string' ? error : 'Unknown conversation error');
          toast.error(`Conversation Error: ${errorMessage}`);
          setStatus('disconnected');
          setIsLoading(false);
          conversationRef.current = null;
        },
        onModeChange: (modeInfo: any) => {
          console.log("Mode changed:", modeInfo);
          setMode(modeInfo.mode === 'speaking' ? 'speaking' : 'listening');
        },
        onMessage: (message: any) => {
          console.log("Received message:", JSON.stringify(message, null, 2));
        }
      });

      console.log("startSession call completed, conversation object:", conversation);
      conversationRef.current = conversation;

    } catch (error: any) {
      console.error('Failed to start conversation (catch block):', error);
      let detailedMessage = 'Failed to start conversation.';
      if (error.name === 'NotAllowedError' || error.message?.includes('Permission denied')) {
          detailedMessage = 'Microphone permission denied. Please allow access.';
      } else if (error.message) {
          detailedMessage += ` Error: ${error.message}`;
      } else {
          detailedMessage += ' Unknown error occurred.';
      }
      toast.error(detailedMessage);
      setIsLoading(false);
    }
  };

  const stopConversation = async () => {
    if (conversationRef.current) {
      try {
        console.log("Attempting to end session manually...");
        const currentConvRef = conversationRef.current;
        conversationRef.current = null;
        await currentConvRef.endSession();
        console.log("Manual session end successful");
        setStatus('disconnected');
        toast.info(`${getTitle()} disconnected.`);
      } catch (error) {
        console.error('Failed to end conversation:', error);
        toast.error(`Failed to end conversation: ${(error as Error).message || 'Unknown error'}`);
        setStatus('disconnected');
      } finally {
          setIsLoading(false);
      }
    } else {
        console.log("Stop called but no active conversation ref found.");
    }
  };

  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        console.log("Component unmounting, cleaning up conversation");
        const currentConvRef = conversationRef.current;
        conversationRef.current = null;
        currentConvRef.endSession().catch((err: Error) => {
            console.error("Error ending session on unmount:", err);
        });
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
