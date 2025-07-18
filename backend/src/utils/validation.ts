// User registration validation
export const validateRegistration = (name: string, email: string, password: string): string | null => {
  if (!name || !email || !password) {
    return 'Please provide all required fields';
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address';
  }
  
  // Validate password
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  return null;
};

// User login validation
export const validateLogin = (email: string, password: string): string | null => {
  if (!email || !password) {
    return 'Please provide both email and password';
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address';
  }
  
  return null;
};

// Flashcard validation
export const validateFlashcard = (question: string, answer: string): string | null => {
  if (!question || !answer) {
    return 'Question and answer are required';
  }
  
  if (question.trim().length < 3) {
    return 'Question must be at least 3 characters long';
  }
  
  if (answer.trim().length < 1) {
    return 'Answer cannot be empty';
  }
  
  return null;
};

// Study session validation
export const validateStudySession = (
  flashcards: string[], 
  startTime: Date, 
  endTime?: Date
): string | null => {
  if (!flashcards || flashcards.length === 0) {
    return 'At least one flashcard is required for a study session';
  }
  
  if (!startTime) {
    return 'Start time is required';
  }
  
  if (endTime && endTime < startTime) {
    return 'End time cannot be before start time';
  }
  
  return null;
};
