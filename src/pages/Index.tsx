
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { BookOpenCheck, Sparkles, FileEdit } from 'lucide-react';
import { useStories } from '@/contexts/StoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { setWidgetContext } from '@/utils/elevenlabsHelper';
import { toast } from 'sonner';
import ElevenLabsConversation from '@/components/ElevenLabsConversation';

const Index = () => {
  const { stories } = useStories();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'none' | 'delivery' | 'star' | 'scratch'>('none');

  const hasStories = stories.length > 0;

  const handleCompanionClick = (type: 'delivery' | 'star' | 'scratch') => {
    setActiveMode(type);
    const message = setWidgetContext(type);
    
    // Show a toast message to guide the user
    toast.success(
      type === 'delivery' 
        ? "Delivery Companion activated" 
        : type === 'star'
          ? "STAR Method Companion activated"
          : "Start from scratch activated",
      { 
        description: message
      }
    );
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card 
              className="overflow-hidden border-2 hover:border-primary transition-colors cursor-pointer bg-gradient-to-br from-purple-50 to-blue-50" 
              onClick={() => handleCompanionClick('delivery')}
            >
              <CardContent className="p-0">
                <div className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="rounded-full bg-blue-100 p-4 mb-4">
                    <BookOpenCheck size={32} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Delivery Companion</h2>
                  <p className="text-muted-foreground">
                    Practice and refine your interview delivery with real-time feedback
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="overflow-hidden border-2 hover:border-primary transition-colors cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50"
              onClick={() => handleCompanionClick('star')}
            >
              <CardContent className="p-0">
                <div className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="rounded-full bg-indigo-100 p-4 mb-4">
                    <Sparkles size={32} className="text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Star Companion</h2>
                  <p className="text-muted-foreground">
                    Get AI guidance to structure your responses using the STAR method
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="overflow-hidden border-2 hover:border-primary transition-colors cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50" 
              onClick={() => handleCompanionClick('scratch')}
            >
              <CardContent className="p-0">
                <div className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="rounded-full bg-pink-100 p-4 mb-4">
                    <FileEdit size={32} className="text-pink-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Start from scratch</h2>
                  <p className="text-muted-foreground">
                    Create a new interview story from the beginning
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!user && (
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
