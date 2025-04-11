
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  // This ensures the widget is loaded after the component mounts
  useEffect(() => {
    // The widget is already loaded in index.html, so we don't need to reload it
    // We just need to make sure the element exists in the DOM
    const existingWidget = document.querySelector('elevenlabs-convai');
    if (!existingWidget) {
      // Create the widget element if it doesn't exist
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', '23g4tA9QfQmk5A2msRMO');
      document.body.appendChild(widget);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="border-b bg-background/95 backdrop-blur-sm z-10 sticky top-0">
        <div className="container flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-primary">
            Star Story Forge
          </Link>
          
          <div className="flex items-center space-x-1">
            <Link to="/stories">
              <Button 
                variant={location.pathname === '/stories' ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <BookOpen size={18} />
                Your Stories
              </Button>
            </Link>
          </div>
          
          <div>
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" className="rounded-full p-2" aria-label="Profile">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-8">
        {children}
      </main>
      
      {/* ElevenLabs Convai Widget is now inserted via useEffect */}
    </div>
  );
};

export default Layout;
