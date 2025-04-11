
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Story } from '@/types';

interface StoryContextType {
  stories: Story[];
  addStory: (story: Story) => void;
  updateStory: (id: string, updatedStory: Story) => void;
  deleteStory: (id: string) => void;
  getStoryById: (id: string) => Story | undefined;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>(() => {
    const savedStories = localStorage.getItem('interview-stories');
    return savedStories ? JSON.parse(savedStories) : [];
  });

  useEffect(() => {
    localStorage.setItem('interview-stories', JSON.stringify(stories));
  }, [stories]);

  const addStory = (story: Story) => {
    setStories((prevStories) => [...prevStories, story]);
  };

  const updateStory = (id: string, updatedStory: Story) => {
    setStories((prevStories) =>
      prevStories.map((story) => (story.id === id ? updatedStory : story))
    );
  };

  const deleteStory = (id: string) => {
    setStories((prevStories) => prevStories.filter((story) => story.id !== id));
  };

  const getStoryById = (id: string) => {
    return stories.find((story) => story.id === id);
  };

  return (
    <StoryContext.Provider
      value={{ stories, addStory, updateStory, deleteStory, getStoryById }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoryProvider');
  }
  return context;
};
