
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

type ConversationMode = 'listening' | 'speaking';
type ConversationStatus = 'disconnected' | 'connected';
type ConversationType = 'delivery' | 'star' | 'scratch';

export const useElevenLabsConversation = (type: ConversationType) => {
  const [status, setStatus] = useState<ConversationStatus>('disconnected');
  const [mode, setMode] = useState<ConversationMode>('listening');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [conversationModule, setConversationModule] = useState<any>(null);
  const conversationRef = useRef<any>(null);

  useEffect(() => {
    // Load ElevenLabs client
    const loadElevenLabsClient = async () => {
      try {
        const module = await import('@11labs/client');
        setConversationModule(module);
      } catch (err) {
        console.error("Failed to load ElevenLabs client:", err);
        toast.error("Failed to load ElevenLabs client");
      }
    };
    
    // Fetch API key
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/elevenlabs-key');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON response but got: ${contentType}. Response text: ${text.substring(0, 100)}...`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setApiKey(data.apiKey);
      } catch (error) {
        console.error("Failed to fetch ElevenLabs API key:", error);
        toast.error("Failed to retrieve API key");
      }
    };

    loadElevenLabsClient();
    fetchApiKey();

    // Cleanup on unmount
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
        overrides: {
          agent: {
            prompt: {
              prompt: getPrompt()
            }
          }
        },
        onConnect: () => {
          console.log("onConnect triggered");
          setStatus('connected');
          toast.success(`${getTitle(type)} connected`);
          setIsLoading(false);
        },
        onDisconnect: (reason?: string) => {
          console.error("onDisconnect triggered. Reason:", reason || 'No reason provided');
          setStatus('disconnected');
          if (conversationRef.current) {
            toast.info(`${getTitle(type)} disconnected unexpectedly.`);
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
        toast.info(`${getTitle(type)} disconnected.`);
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

  return {
    status,
    mode,
    isLoading,
    startConversation,
    stopConversation
  };
};

const getTitle = (type: 'delivery' | 'star' | 'scratch') => {
  switch(type) {
    case 'delivery': return 'Delivery Companion';
    case 'star': return 'STAR Method Companion';
    case 'scratch': return 'Start From Scratch';
  }
};
