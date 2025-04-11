
/**
 * Helper functions to interact with ElevenLabs Convai widget
 */

/**
 * Triggers the ElevenLabs Convai widget to open with a specific context
 * @param context Optional context to set for the conversation
 */
export const openElevenLabsWidget = (context?: string) => {
  // Find the widget element
  const widget = document.querySelector('elevenlabs-convai') as HTMLElement;
  
  if (!widget) {
    console.error('ElevenLabs widget not found');
    return;
  }

  // First make sure the widget is visible
  widget.style.display = 'block';
  
  // Force a click on the widget to open it
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  
  widget.dispatchEvent(clickEvent);
  
  // If we have a context, we could set it here
  // This would require additional widget API implementation
};

/**
 * Set the context for the conversation - this would need to be implemented 
 * based on the available ElevenLabs API
 */
export const setWidgetContext = (type: 'delivery' | 'star') => {
  // In a real implementation, we would communicate with the widget
  // using its API to set the context
  console.log(`Setting widget context to: ${type}`);
  
  // Example of how we might set context if the API supports it
  const message = type === 'delivery' 
    ? "I'll help you practice delivering your interview stories effectively."
    : "I'll help you structure your responses using the STAR method.";
    
  // For now we just return the message that could be displayed to the user
  return message;
};
