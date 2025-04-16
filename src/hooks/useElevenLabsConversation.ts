
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

type ConversationMode = 'listening' | 'speaking';
type ConversationStatus = 'disconnected' | 'connected';
type ConversationType = 'delivery' | 'star' | 'scratch';

export const useElevenLabsConversation = (type: ConversationType) => {
  const [status, setStatus] = useState<ConversationStatus>('disconnected');
  const [mode, setMode] = useState<ConversationMode>('listening');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationModule, setConversationModule] = useState<any>(null);
  const [isModuleLoaded, setIsModuleLoaded] = useState(false);
  const conversationRef = useRef<any>(null);

  // Use the provided API key
  const apiKey = 'sk_d606a16d35671cfcb347ab94ca2d304b6fb9333cd570293f';

  useEffect(() => {
    // Load ElevenLabs client
    let isMounted = true;
    
    const loadElevenLabsClient = async () => {
      try {
        console.log("Loading ElevenLabs client...");
        const module = await import('@11labs/client');
        if (isMounted) {
          console.log("ElevenLabs client loaded successfully");
          setConversationModule(module);
          setIsModuleLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load ElevenLabs client:", err);
        if (isMounted) {
          toast.error("Failed to load ElevenLabs client. Please refresh the page and try again.");
        }
      }
    };

    loadElevenLabsClient();

    // Cleanup on unmount
    return () => {
      isMounted = false;
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
      toast.error("ElevenLabs API key is missing. Please configure it.");
      setIsLoading(false);
      return;
    }

    if (!isModuleLoaded || !conversationModule) {
      toast.error("ElevenLabs client is still loading. Please wait a moment and try again.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await navigator.mediaDevices.getUserMedia({ audio: true });

      console.log("Starting conversation with prompt:", getPrompt());
      console.log("Using Agent ID:", '23g4tA9QfQmk5A2msRMO');

      console.log("Starting session");
      const conversation = await conversationModule.Conversation.startSession({
        apiKey: apiKey,
        agentId: '23g4tA9QfQmk5A2msRMO',
        overrides: {
          agent: {
            // prompt: {
            //   prompt: getPrompt()
            // }
          }
        },
        onConnect: () => {
          setStatus('connected');
          toast.success(`${getTitle(type)} connected`);
          setIsLoading(false);
        },
        onDisconnect: (reason?: string) => {
          console.error("Disconnected:", reason);
          setStatus('disconnected');
          if (conversationRef.current) {
            toast.info(`${getTitle(type)} disconnected unexpectedly.`);
          }
          setIsLoading(false);
          conversationRef.current = null;
        },
        onError: (error: any) => {
          console.error("Conversation error:", error);
          toast.error(`Conversation Error: ${error?.message || 'Unknown error'}`);
          setStatus('disconnected');
          setIsLoading(false);
          conversationRef.current = null;
        },
        onModeChange: (modeInfo: any) => {
          setMode(modeInfo.mode === 'speaking' ? 'speaking' : 'listening');
        },
        onMessage: (message: any) => {
          console.log("Message received:", message);
        }
      });

      conversationRef.current = conversation;

    } catch (error: any) {
      console.error("Start failed:", error);
      let detailedMessage = 'Failed to start conversation.';
      if (error.name === 'NotAllowedError' || error.message?.includes('Permission denied')) {
        detailedMessage = 'Microphone permission denied. Please allow access.';
      } else if (error.message) {
        detailedMessage += ` Error: ${error.message}`;
      }
      toast.error(detailedMessage);
      setIsLoading(false);
    }
  };

  const stopConversation = async () => {
    if (conversationRef.current) {
      try {
        const currentConvRef = conversationRef.current;
        conversationRef.current = null;
        await currentConvRef.endSession();
        setStatus('disconnected');
        toast.info(`${getTitle(type)} disconnected.`);
      } catch (error) {
        console.error("End failed:", error);
        toast.error(`Failed to end conversation: ${error?.message || 'Unknown error'}`);
        setStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("No conversation to stop.");
    }
  };

  return {
    status,
    mode,
    isLoading,
    isModuleLoaded,
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
