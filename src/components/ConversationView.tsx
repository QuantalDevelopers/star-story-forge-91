
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';

interface ConversationViewProps {
  storyTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// This is a mock conversation for demonstration
// In a real implementation, this would come from a database or context
const mockConversation = {
  audioUrl: null, // This would be the URL to the audio file
  transcript: [
    {
      role: 'ai',
      content: 'Hello! I understand you have a story about implementing Agile methodology. Can you tell me more about the situation?'
    },
    {
      role: 'user',
      content: 'Our team was struggling with project deadlines and quality issues with our traditional waterfall approach.'
    },
    {
      role: 'ai',
      content: 'I see. What was your task or role in this situation?'
    },
    {
      role: 'user',
      content: 'As the tech lead, I needed to find a more efficient development process to improve productivity and code quality.'
    },
    {
      role: 'ai',
      content: 'That sounds challenging. What actions did you take to address this?'
    },
    {
      role: 'user',
      content: 'I researched various methodologies, took a certification in Agile/Scrum, and presented a transition plan to management. I then led training sessions for the team and implemented daily stand-ups, sprint planning, and retrospectives.'
    },
    {
      role: 'ai',
      content: 'Very thorough approach! And what was the result of implementing these changes?'
    },
    {
      role: 'user',
      content: 'Within three months, our on-time delivery improved by 40%, and bug reports decreased by 25%. The team reported higher job satisfaction, and we received recognition from upper management for the transformation.'
    },
  ]
};

const ConversationView: React.FC<ConversationViewProps> = ({ storyTitle, open, onOpenChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

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

  // This would be used in a real implementation with actual audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{storyTitle} - Conversation</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="audio" className="w-full">
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
                {mockConversation.audioUrl 
                  ? <audio 
                      ref={audioRef} 
                      src={mockConversation.audioUrl} 
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                    />
                  : "Audio for this conversation is not available. Use the ElevenLabs conversation feature to create a new conversation."
                }
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text">
            <div className="space-y-4 py-2">
              {mockConversation.transcript.map((message, index) => (
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationView;
