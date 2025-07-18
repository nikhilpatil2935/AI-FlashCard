import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Flashcard from './Flashcard';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Flashcard as FlashcardType, FlashcardDeck } from '../../types';
import * as api from '../../services/api';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Mock data for now
const mockDeck: FlashcardDeck = {
  id: '1',
  title: 'Spanish Vocabulary',
  description: 'Common Spanish words and phrases',
  isPublic: true,
  tags: ['spanish', 'language'],
  userId: 'user1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  flashcards: [
    { id: 'c1', question: 'Hola', answer: 'Hello', difficulty: 'easy', tags: [], userId: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'c2', question: 'Adiós', answer: 'Goodbye', difficulty: 'easy', tags: [], userId: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'c3', question: 'Gracias', answer: 'Thank you', difficulty: 'medium', tags: [], userId: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'c4', question: 'Por favor', answer: 'Please', difficulty: 'medium', tags: [], userId: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'c5', question: 'Lo siento', answer: 'I\'m sorry', difficulty: 'hard', tags: [], userId: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]
};

const StudySession: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ cardId: string; correct: boolean }[]>([]);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        // Replace with actual API call: const fetchedDeck = await api.getDeck(deckId);
        setDeck(mockDeck);
      } catch (err) {
        setError('Failed to load the deck. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeck();
  }, [deckId]);

  const handleNextCard = (correct: boolean) => {
    setSessionResults([...sessionResults, { cardId: deck!.flashcards[currentIndex].id, correct }]);
    setShowAnswer(false);

    if (currentIndex < deck!.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsSessionComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionResults([]);
    setIsSessionComplete(false);
  };

  const progressPercentage = useMemo(() => {
    if (!deck) return 0;
    return ((currentIndex + 1) / deck.flashcards.length) * 100;
  }, [currentIndex, deck]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="large" /></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!deck) {
    return <div className="min-h-screen flex items-center justify-center">Deck not found.</div>;
  }

  if (isSessionComplete) {
    const correctCount = sessionResults.filter(r => r.correct).length;
    const totalCount = sessionResults.length;
    const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <Card padding="large">
          <SparklesIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Session Complete!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Great job on completing your study session for "{deck.title}".
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
              <p className="text-2xl font-bold text-green-600">{accuracy.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
              <p className="text-2xl font-bold text-blue-600">{correctCount} / {totalCount}</p>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={handleRestart}>Study Again</Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentCard = deck.flashcards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
        {deck.title}
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Card {currentIndex + 1} of {deck.flashcards.length}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
        <motion.div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
        >
          <Flashcard
            flashcard={currentCard}
            showAnswer={showAnswer}
            onToggleAnswer={() => setShowAnswer(!showAnswer)}
            onCorrect={() => handleNextCard(true)}
            onIncorrect={() => handleNextCard(false)}
            showActions
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StudySession;
