
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Story } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit2, Play, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StoryCardProps {
  story: Story;
  onDelete: (id: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onDelete }) => {
  const truncate = (text: string, length = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

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
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" onClick={() => onDelete(story.id)}>
          <Trash2 size={16} className="mr-1" /> Delete
        </Button>
        <div className="flex gap-2">
          <Link to={`/practice/${story.id}`}>
            <Button variant="ghost" size="sm">
              <Play size={16} className="mr-1" /> Practice
            </Button>
          </Link>
          <Link to={`/edit/${story.id}`}>
            <Button variant="outline" size="sm">
              <Edit2 size={16} className="mr-1" /> Edit
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
