
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Story } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2 } from 'lucide-react';
import ConversationView from './ConversationView';

interface StoryCardProps {
  story: Story;
  onDelete: (id: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onDelete }) => {
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  
  const truncate = (text: string, length = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  const hasConversation = Boolean(story.conversation && (story.conversation.messages?.length > 0 || story.conversation.audioUrl));

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{story.title}</CardTitle>
          <Badge variant="outline" className="bg-accent text-accent-foreground">
            {story.principle}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{truncate(story.situation)}</p>
        <div className="mt-2 text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(story.updatedAt), { addSuffix: true })}
        </div>
        {hasConversation && (
          <div className="mt-2 text-xs text-primary-foreground">
            <Badge variant="secondary" className="bg-primary/10">
              <MessageSquare size={12} className="mr-1" /> Has conversation
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" onClick={() => onDelete(story.id)}>
          <Trash2 size={16} className="mr-1" /> Delete
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsConversationOpen(true)}
        >
          <MessageSquare size={16} className="mr-1" /> View Conversation
        </Button>
      </CardFooter>
      
      <ConversationView 
        storyId={story.id}
        open={isConversationOpen}
        onOpenChange={setIsConversationOpen}
      />
    </Card>
  );
};

export default StoryCard;
