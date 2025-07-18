// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Flashcard types
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  userId: string;
  deckId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description?: string;
  flashcards: Flashcard[];
  userId: string;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Study Session types
export interface StudySession {
  id: string;
  userId: string;
  deckId: string;
  startTime: string;
  endTime?: string;
  cardsStudied: number;
  correctAnswers: number;
  totalCards: number;
  accuracy: number;
  timeSpent: number; // in seconds
}

export interface StudyProgress {
  cardId: string;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Content Processing types
export interface ProcessContentRequest {
  content: string;
  type: 'text' | 'pdf' | 'image';
  numberOfCards?: number;
}

export interface GeneratedFlashcard {
  question: string;
  answer: string;
  confidence: number;
}

// Theme types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Auth Context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Form types
export interface FormErrors {
  [key: string]: string;
}

// Component Props types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}
