import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useStories } from '@/contexts/StoryContext';

type ConversationMode = 'listening' | 'speaking';
type ConversationStatus = 'disconnected' | 'connected';
type ConversationType = 'delivery' | 'star' | 'scratch';
type ConversationMessage = {
  role: 'ai' | 'user';
  content: string;
};

export const useElevenLabsConversation = (type: ConversationType, storyId?: string) => {
  const [status, setStatus] = useState<ConversationStatus>('disconnected');
  const [mode, setMode] = useState<ConversationMode>('listening');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationModule, setConversationModule] = useState<any>(null);
  const [isModuleLoaded, setIsModuleLoaded] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const conversationRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const inactivityTimerRef = useRef<any>(null);
  const INACTIVITY_TIMEOUT = 180000; // 3 minutes of inactivity
  const { updateStory, getStoryById } = useStories();

  // Use the provided API key
  const apiKey = 'sk_d606a16d35671cfcb347ab94ca2d304b6fb9333cd570293f';

  // Clear inactivity timer when component unmounts
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    if (status === 'connected') {
      inactivityTimerRef.current = setTimeout(() => {
        toast.info("You've been inactive for a while. The conversation will end soon if there's no activity.");
        
        // Give another minute before actually disconnecting
        setTimeout(() => {
          if (status === 'connected') {
            stopConversation();
          }
        }, 60000);
      }, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    // Load ElevenLabs client
    let isMounted = true;
    
    const loadElevenLabsClient = async () => {
      try {
        console.log("Loading ElevenLabs client...");
        // Import client synchronously to speed up loading
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

    // Load immediately
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
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Reset inactivity timer whenever user speaks or AI speaks
    if (mode === 'listening' || mode === 'speaking') {
      resetInactivityTimer();
    }
  }, [mode, status]);

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

      // Clear previous messages and audio chunks
      setMessages([]);
      audioChunksRef.current = [];

      console.log("Starting session");
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
          setStatus('connected');
          toast.success(`${getTitle(type)} connected`);
          setIsLoading(false);
          resetInactivityTimer();
        },
        onDisconnect: (reason?: string) => {
          console.log("Disconnected:", reason);
          setStatus('disconnected');
          if (conversationRef.current) {
            toast.info(`${getTitle(type)} disconnected.`);
          }
          setIsLoading(false);
          conversationRef.current = null;
          
          // Create audio blob from collected chunks
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            
            // Save conversation to story if we have a storyId
            if (storyId && messages.length > 0) {
              const story = getStoryById(storyId);
              if (story) {
                updateStory(storyId, {
                  ...story,
                  conversation: {
                    messages: [...messages],
                    audioUrl: url,
                    timestamp: new Date().toISOString()
                  },
                  updatedAt: new Date().toISOString()
                });
                toast.success("Conversation saved to story");
              }
            }
          }
          
          if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
          }
        },
        onError: (error: any) => {
          console.error("Conversation error:", error);
          toast.error(`Conversation Error: ${error?.message || 'Unknown error'}`);
          setStatus('disconnected');
          setIsLoading(false);
          conversationRef.current = null;
          
          if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
          }
        },
        onModeChange: (modeInfo: any) => {
          setMode(modeInfo.mode === 'speaking' ? 'speaking' : 'listening');
          resetInactivityTimer();
        },
        onMessage: (message: any) => {
          console.log("Message received:", message);
          
          // Only process final messages, not tentative ones
          if (message.source === 'ai' || message.source === 'user') {
            const newMessage = {
              role: message.source,
              content: message.message
            };
            
            setMessages(prevMessages => [...prevMessages, newMessage]);
          }
          
          // Store audio chunks for later playback
          if (message.audioChunk) {
            audioChunksRef.current.push(message.audioChunk);
          }
          
          // Reset inactivity timer on message activity
          resetInactivityTimer();
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
        
        // Create audio blob from collected chunks
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          
          // Save conversation to story if we have a storyId
          if (storyId && messages.length > 0) {
            const story = getStoryById(storyId);
            if (story) {
              updateStory(storyId, {
                ...story,
                conversation: {
                  messages: [...messages],
                  audioUrl: url,
                  timestamp: new Date().toISOString()
                },
                updatedAt: new Date().toISOString()
              });
              toast.success("Conversation saved to story");
            }
          }
        }
        
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
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
    messages,
    audioUrl,
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
