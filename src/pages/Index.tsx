
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useStories } from '@/contexts/StoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { setWidgetContext } from '@/utils/elevenlabsHelper';
import { toast } from 'sonner';
import ElevenLabsConversation from '@/components/ElevenLabsConversation';

const Index = () => {
  const { stories } = useStories();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'none' | 'delivery'>('none');

  const hasStories = stories.length > 0;

  const handleVoiceDesignClick = () => {
    setActiveMode('delivery');
    const message = setWidgetContext('delivery');
    
    // Show a toast message to guide the user
    toast.success("Voice Design activated", { 
      description: "Click on the circle to start or stop conversation"
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
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
        ) : activeMode !== 'none' ? (
          <ElevenLabsConversation 
            type={activeMode} 
            onClose={() => setActiveMode('none')} 
          />
        ) : (
          <div className="flex justify-center items-center py-10">
            <div 
              onClick={handleVoiceDesignClick}
              className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-400 via-indigo-500 to-teal-400 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <div className="w-56 h-56 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center justify-center text-white p-6">
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-3"
                >
                  <path 
                    d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="text-xl font-bold">Voice Design</h2>
                <p className="text-sm text-center opacity-90 mt-1">
                  Tap to start conversation
                </p>
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="mt-20 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent mb-4">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 text-primary" 
              >
                <path 
                  d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Prepare Better, Interview Stronger</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Use our AI assistance to help craft compelling STAR stories that showcase your 
              leadership abilities and experience.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="animate-slide-up"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
