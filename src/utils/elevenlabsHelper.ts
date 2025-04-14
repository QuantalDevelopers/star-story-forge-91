
/**
 * Helper functions to interact with ElevenLabs Convai widget
 */

/**
 * Set the context for the conversation
 */
export const setWidgetContext = (type: 'delivery' | 'star' | 'scratch') => {
  // Log the context type for debugging
  console.log(`Setting widget context to: ${type}`);
  
  // Return appropriate message based on the context type
  switch(type) {
    case 'delivery':
      return "I'll help you practice delivering your interview stories effectively with real-time feedback on your communication style.";
    case 'star':
      return "I'll help you structure your responses using the STAR method (Situation, Task, Action, Result) for impactful storytelling.";
    case 'scratch':
      return "I'll help you create new interview stories from the beginning, guiding you through the entire process.";
    default:
      return "How can I help you with your interview preparation today?";
  }
};
