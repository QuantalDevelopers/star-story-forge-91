
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useStories } from '@/contexts/StoryContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BookOpen, Search } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import StoryCard from '@/components/StoryCard';
import { LEADERSHIP_PRINCIPLES } from '@/types';

const Stories = () => {
  const { stories, deleteStory } = useStories();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredStories = stories.filter((story) => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         story.situation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || story.principle === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Story Bank</h1>
        <p className="text-muted-foreground">
          Manage all your STAR format interview stories.
        </p>
      </div>

      {stories.length === 0 ? (
        <EmptyState
          title="Your story bank is empty"
          description="Create your first interview story to build your collection."
          buttonText="Create a Story"
          buttonLink="/create"
          icon="book"
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by principle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Principles</SelectItem>
                {LEADERSHIP_PRINCIPLES.map((principle) => (
                  <SelectItem key={principle.name} value={principle.name}>
                    {principle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No matching stories</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredStories.map((story) => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  onDelete={deleteStory} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default Stories;
