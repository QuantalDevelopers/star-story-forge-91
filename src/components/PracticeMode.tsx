
import React, { useState, useEffect } from 'react';
import { Story, PRACTICE_QUESTIONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Mic, MicOff, RefreshCw, ThumbsUp } from 'lucide-react';

interface PracticeModeProps {
  story: Story;
  onFinish: () => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ story, onFinish }) => {
  const [activeTab, setActiveTab] = useState('question');
  const [recordingMode, setRecordingMode] = useState(false);
  const [practiceQuestion, setPracticeQuestion] = useState('');
  const [completedPractice, setCompletedPractice] = useState(false);

  useEffect(() => {
    // Get a random question or one related to the principle
    const getRandomQuestion = () => {
      const randomIndex = Math.floor(Math.random() * PRACTICE_QUESTIONS.length);
      return PRACTICE_QUESTIONS[randomIndex];
    };
    
    setPracticeQuestion(getRandomQuestion());
  }, [story.principle]);

  const handleRecordToggle = () => {
    setRecordingMode(!recordingMode);
  };

  const handleNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * PRACTICE_QUESTIONS.length);
    setPracticeQuestion(PRACTICE_QUESTIONS[randomIndex]);
    setActiveTab('question');
    setRecordingMode(false);
  };

  const handleFinishPractice = () => {
    setCompletedPractice(true);
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      {!completedPractice ? (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="question">Question</TabsTrigger>
              <TabsTrigger value="story">Your Story</TabsTrigger>
            </TabsList>
            <TabsContent value="question" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Practice Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-medium">{practiceQuestion}</p>
                  <div className="mt-4 p-3 bg-accent rounded-md">
                    <p className="text-sm font-medium">Principle: {story.principle}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleNewQuestion}>
                    <RefreshCw size={16} className="mr-2" />
                    New Question
                  </Button>
                  <Button onClick={() => setActiveTab('story')}>
                    View Story <ChevronRight size={16} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="story" className="space-y-4 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your STAR Story</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Situation</h3>
                    <p className="text-sm">{story.situation}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Task</h3>
                    <p className="text-sm">{story.task}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Action</h3>
                    <p className="text-sm">{story.action}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Result</h3>
                    <p className="text-sm">{story.result}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('question')}>
                    <ChevronLeft size={16} className="mr-2" />
                    Back to Question
                  </Button>
                  <Button onClick={handleRecordToggle}>
                    {recordingMode ? (
                      <>
                        <MicOff size={16} className="mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic size={16} className="mr-2" />
                        Start Practice
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {recordingMode && (
                <Card className="border-2 border-primary animate-pulse">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Mic size={48} className="text-primary mb-4" />
                      <p className="text-center font-medium">Recording your answer...</p>
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        Speak your answer out loud to practice
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleFinishPractice}>
                      Finish Practice
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="text-center py-8 animate-fade-in">
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <ThumbsUp size={48} className="text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold">Great Practice!</h2>
            <p className="text-muted-foreground">
              You've completed this practice session. Keep practicing to improve your interview skills.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button variant="outline" onClick={handleNewQuestion}>
              Practice Again
            </Button>
            <Button onClick={onFinish}>
              Back to Stories
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PracticeMode;
