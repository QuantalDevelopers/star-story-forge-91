
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { BookOpenCheck, Filter, Sparkles } from 'lucide-react';
import { useStories } from '@/contexts/StoryContext';
import EmptyState from '@/components/EmptyState';
import StoryCard from '@/components/StoryCard';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { stories, deleteStory } = useStories();
  const { user } = useAuth();
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

        {!user ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">Welcome to STAR Story Forge</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Sign in to manage your interview stories and prepare for your next interview.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
            >
              Sign In or Create Account
            </Button>
          </div>
        ) : !hasStories ? (
          <EmptyState
            title="No stories yet"
            description="Your story collection is empty. Import existing stories or browse the story collection."
            buttonText="Browse Stories"
            buttonLink="/stories"
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
          {!user ? (
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="animate-slide-up"
            >
              Get Started
            </Button>
          ) : (
            <Button 
              size="lg"
              onClick={() => navigate('/stories')} 
              className="animate-slide-up"
            >
              Browse Stories
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
