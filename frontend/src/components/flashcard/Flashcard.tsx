import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Flashcard as FlashcardType } from '../../types';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface FlashcardProps {
  flashcard: FlashcardType;
  showAnswer?: boolean;
  onToggleAnswer?: () => void;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  showActions?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({
  flashcard,
  showAnswer,
  onToggleAnswer,
  onCorrect,
  onIncorrect,
  showActions = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onToggleAnswer) {
      onToggleAnswer();
    }
  };

  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full h-80 cursor-pointer"
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped || showAnswer ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card (Question) */}
          <Card 
            className="absolute inset-0 w-full h-full flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center p-6">
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Question
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {flashcard.question}
              </h2>
              <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                <EyeIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">Click to reveal answer</span>
              </div>
            </div>
          </Card>

          {/* Back of card (Answer) */}
          <Card 
            className="absolute inset-0 w-full h-full flex items-center justify-center backface-hidden"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="text-center p-6">
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Answer
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {flashcard.answer}
              </h2>
              <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                <EyeSlashIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">Click to hide answer</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Action buttons for study sessions */}
      {showActions && (isFlipped || showAnswer) && (
        <motion.div 
          className="mt-6 flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="danger"
            onClick={onIncorrect}
            className="flex-1 max-w-32"
          >
            Incorrect
          </Button>
          <Button
            variant="success"
            onClick={onCorrect}
            className="flex-1 max-w-32"
          >
            Correct
          </Button>
        </motion.div>
      )}

      {/* Difficulty indicator */}
      {flashcard.difficulty && (
        <div className="mt-4 flex justify-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            flashcard.difficulty === 'easy' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : flashcard.difficulty === 'medium'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          }`}>
            {flashcard.difficulty}
          </span>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
