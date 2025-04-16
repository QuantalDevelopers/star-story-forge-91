
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, MessageSquare } from 'lucide-react';
import { useStories } from '@/contexts/StoryContext';

interface ConversationViewProps {
  storyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ storyId, open, onOpenChange }) => {
  const { getStoryById } = useStories();
  const story = getStoryById(storyId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // This would be connected to a real API in production
  // For now we'll use the mock conversation stored in the story context
  const conversation = {
    audioUrl: null, 
    transcript: [
      {
        role: 'ai',
        content: 'Hello! I understand you have a story about ' + story?.title + '. Can you tell me more about the situation?'
      },
      {
        role: 'user',
        content: story?.situation || 'Our team was facing challenges with the current process.'
      },
      {
        role: 'ai',
        content: 'I see. What was your task or role in this situation?'
      },
      {
        role: 'user',
        content: story?.task || 'I needed to find a solution to improve the process.'
      },
      {
        role: 'ai',
        content: 'That sounds challenging. What actions did you take to address this?'
      },
      {
        role: 'user',
        content: story?.action || 'I researched options, developed a plan, and led the implementation.'
      },
      {
        role: 'ai',
        content: 'Very thorough approach! And what was the result of implementing these changes?'
      },
      {
        role: 'user',
        content: story?.result || 'We saw significant improvements in efficiency and team satisfaction.'
      },
    ]
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Reset player when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{story?.title || 'Conversation'}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="text">Transcript</TabsTrigger>
          </TabsList>
          <TabsContent value="audio" className="py-4">
            <div className="bg-card rounded-md border p-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePlayPause}
                  className="h-12 w-12 rounded-full"
                  disabled={!conversation.audioUrl}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>
                
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded overflow-hidden">
                    <div 
                      className="bg-primary h-2" 
                      style={{ width: `${(currentTime / (audioRef.current?.duration || 1)) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>
                      {Math.floor(currentTime / 60)}:
                      {String(Math.floor(currentTime % 60)).padStart(2, '0')}
                    </span>
                    <span>
                      {audioRef.current?.duration 
                        ? `${Math.floor((audioRef.current.duration) / 60)}:${String(Math.floor((audioRef.current.duration) % 60)).padStart(2, '0')}` 
                        : '0:00'}
                    </span>
                  </div>
                </div>
                
                <Volume2 size={18} className="text-muted-foreground" />
              </div>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {conversation.audioUrl 
                  ? <audio 
                      ref={audioRef} 
                      src={conversation.audioUrl} 
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                    />
                  : "Audio for this conversation is not yet available. Use the ElevenLabs conversation feature to create a new conversation with audio recording."
                }
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text">
            <div className="space-y-4 py-2">
              {conversation.transcript.length > 0 ? (
                conversation.transcript.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${
                      message.role === 'ai' 
                        ? 'bg-accent text-accent-foreground ml-4' 
                        : 'bg-primary text-primary-foreground mr-4'
                    }`}
                  >
                    <div className="font-medium mb-1">
                      {message.role === 'ai' ? 'Interview Coach' : 'You'}
                    </div>
                    <p>{message.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>No conversation transcript available yet.</p>
                  <p className="text-sm mt-1">Start a conversation to see the transcript here.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationView;
