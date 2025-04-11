
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { BookOpenCheck, Filter, Plus, Sparkles } from 'lucide-react';
import { useStories } from '@/contexts/StoryContext';
import EmptyState from '@/components/EmptyState';
import StoryCard from '@/components/StoryCard';

const Index = () => {
  const { stories, deleteStory } = useStories();
  const navigate = useNavigate();

  const hasStories = stories.length > 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">STAR Story Forge</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Create, practice, and iterate your behavioral interview stories using the STAR format.
          </p>
        </div>

        {!hasStories ? (
          <EmptyState
            title="No stories yet"
            description="Create your first interview story to get started. Use the STAR format to structure your experiences."
            buttonText="Create Your First Story"
            buttonLink="/create"
            icon="file"
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <BookOpenCheck size={20} className="mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Your Stories</h2>
                <div className="ml-3 bg-secondary text-muted-foreground px-2 py-1 rounded-md text-xs">
                  {stories.length} {stories.length === 1 ? 'story' : 'stories'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter size={16} className="mr-1" />
                  Filter
                </Button>
                <Button onClick={() => navigate('/create')}>
                  <Plus size={16} className="mr-1" />
                  New Story
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {stories.map((story) => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  onDelete={deleteStory} 
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent mb-4">
            <Sparkles size={16} className="mr-2 text-primary" />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Prepare Better, Interview Stronger</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Use our AI assistance to help craft compelling STAR stories that showcase your 
            leadership abilities and experience.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/create')}
            className="animate-slide-up"
          >
            Get Started
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
