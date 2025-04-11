
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/stories', label: 'My Stories', icon: <BookOpen size={20} /> },
    user 
      ? { path: '/profile', label: 'Profile', icon: <User size={20} /> }
      : { path: '/auth', label: 'Sign In', icon: <LogIn size={20} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-6 border-b">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">STAR Story Forge</h1>
          {user && (
            <div className="text-sm text-muted-foreground">
              {user.email}
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-8 max-w-4xl">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 w-full border-t bg-background/95 backdrop-blur-sm z-10">
        <div className="container flex justify-between items-center py-2 px-4">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                className="flex flex-col gap-1 h-auto py-2"
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
