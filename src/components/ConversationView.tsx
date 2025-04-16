
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, MessageSquare, User, Bot } from 'lucide-react';
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
  const [duration, setDuration] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(1);

  // Get conversation data from the story
  const conversation = story?.conversation || { 
    audioUrl: null, 
    messages: [],
    timestamp: null
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

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle seeking in the audio player
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            {story?.title || 'Conversation'} Transcript
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="text" className="w-full flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="audio" className="flex items-center">
              <Volume2 className="mr-2 h-4 w-4" />
              Voice Chat
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Text Transcript
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio" className="py-4 flex-1 overflow-auto">
            <div className="bg-card rounded-md border p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePlayPause}
                  className="h-14 w-14 rounded-full"
                  disabled={!conversation.audioUrl}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max={duration || 1}
                      step="0.01"
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                      disabled={!conversation.audioUrl}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-3 px-2">
                <Volume2 size={18} className="text-muted-foreground" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                  disabled={!conversation.audioUrl}
                />
              </div>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {conversation.audioUrl ? (
                  <audio 
                    ref={audioRef} 
                    src={conversation.audioUrl} 
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />
                ) : (
                  <div className="p-6 bg-accent/10 rounded-lg">
                    <p className="font-medium mb-2">Audio recording not available</p>
                    <p>Start a conversation with the AI coach to generate an audio recording of your interview practice.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="flex-1 overflow-auto pr-2">
            <div className="space-y-4 py-2">
              {conversation.messages && conversation.messages.length > 0 ? (
                conversation.messages.map((message: any, index: number) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${
                      message.role === 'ai' 
                        ? 'bg-accent/20 border border-accent/20 ml-4' 
                        : 'bg-primary/10 border border-primary/10 mr-4'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-2 
                        ${message.role === 'ai' 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {message.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div className="font-medium">
                        {message.role === 'ai' ? 'Interview Coach' : 'You'}
                      </div>
                      <div className="text-xs text-muted-foreground ml-auto">
                        {conversation.timestamp ? new Date(conversation.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : new Date().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <p className="pl-10">{message.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p className="font-medium">No conversation transcript available yet.</p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Start a conversation to see the transcript here.
                  </p>
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
