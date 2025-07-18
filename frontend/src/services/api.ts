import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  ApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  User,
  Flashcard,
  FlashcardDeck,
  StudySession,
  ProcessContentRequest,
  GeneratedFlashcard 
} from '../types';

// Create axios instance with base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth API functions
export const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  return api.post('/users/login', credentials);
};

export const register = async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
  return api.post('/users/register', userData);
};

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  return api.get('/users/profile');
};

export const updateProfile = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
  return api.put('/users/profile', userData);
};

// Flashcard API functions
export const getFlashcards = async (): Promise<ApiResponse<Flashcard[]>> => {
  return api.get('/flashcards');
};

export const getFlashcard = async (id: string): Promise<ApiResponse<Flashcard>> => {
  return api.get(`/flashcards/${id}`);
};

export const createFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Flashcard>> => {
  return api.post('/flashcards', flashcard);
};

export const updateFlashcard = async (id: string, flashcard: Partial<Flashcard>): Promise<ApiResponse<Flashcard>> => {
  return api.put(`/flashcards/${id}`, flashcard);
};

export const deleteFlashcard = async (id: string): Promise<ApiResponse<void>> => {
  return api.delete(`/flashcards/${id}`);
};

// Deck API functions
export const getDecks = async (): Promise<ApiResponse<FlashcardDeck[]>> => {
  return api.get('/flashcards/decks');
};

export const getDeck = async (id: string): Promise<ApiResponse<FlashcardDeck>> => {
  return api.get(`/flashcards/decks/${id}`);
};

export const createDeck = async (deck: Omit<FlashcardDeck, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<FlashcardDeck>> => {
  return api.post('/flashcards/decks', deck);
};

export const updateDeck = async (id: string, deck: Partial<FlashcardDeck>): Promise<ApiResponse<FlashcardDeck>> => {
  return api.put(`/flashcards/decks/${id}`, deck);
};

export const deleteDeck = async (id: string): Promise<ApiResponse<void>> => {
  return api.delete(`/flashcards/decks/${id}`);
};

// Content Processing API functions
export const generateFlashcardsFromText = async (content: string, numberOfCards?: number): Promise<ApiResponse<GeneratedFlashcard[]>> => {
  return api.post('/flashcards/generate/text', { content, numberOfCards });
};

export const generateFlashcardsFromFile = async (file: File, numberOfCards?: number): Promise<ApiResponse<GeneratedFlashcard[]>> => {
  const formData = new FormData();
  formData.append('file', file);
  if (numberOfCards) {
    formData.append('numberOfCards', numberOfCards.toString());
  }

  return api.post('/flashcards/generate/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const generateFlashcardsFromPDF = async (file: File, numberOfCards?: number): Promise<ApiResponse<GeneratedFlashcard[]>> => {
  const formData = new FormData();
  formData.append('pdf', file);
  if (numberOfCards) {
    formData.append('numberOfCards', numberOfCards.toString());
  }

  return api.post('/flashcards/generate/pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const generateFlashcardsFromImage = async (file: File, numberOfCards?: number): Promise<ApiResponse<GeneratedFlashcard[]>> => {
  const formData = new FormData();
  formData.append('image', file);
  if (numberOfCards) {
    formData.append('numberOfCards', numberOfCards.toString());
  }

  return api.post('/flashcards/generate/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Study Session API functions
export const getStudySessions = async (): Promise<ApiResponse<StudySession[]>> => {
  return api.get('/study-sessions');
};

export const createStudySession = async (session: Omit<StudySession, 'id'>): Promise<ApiResponse<StudySession>> => {
  return api.post('/study-sessions', session);
};

export const updateStudySession = async (id: string, session: Partial<StudySession>): Promise<ApiResponse<StudySession>> => {
  return api.put(`/study-sessions/${id}`, session);
};

export const getStudyStats = async (): Promise<ApiResponse<any>> => {
  return api.get('/study-sessions/stats');
};

// Export the configured axios instance for direct use if needed
export default api;
