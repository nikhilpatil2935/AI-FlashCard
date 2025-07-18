import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  LightBulbIcon, 
  DocumentTextIcon, 
  PlusCircleIcon,
  TrashIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Flashcard } from '../../types';
import * as api from '../../services/api';

const flashcardSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

const deckSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  sourceText: z.string().optional(),
  flashcards: z.array(flashcardSchema).min(1, 'At least one flashcard is required'),
});

type DeckFormData = z.infer<typeof deckSchema>;

const FlashcardCreator: React.FC = () => {
  const [generationMode, setGenerationMode] = useState<'text' | 'manual'>('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    register, 
    control, 
    handleSubmit, 
    setValue,
    watch,
    formState: { errors } 
  } = useForm<DeckFormData>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      title: '',
      description: '',
      sourceText: '',
      flashcards: [{ question: '', answer: '' }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "flashcards"
  });

  const sourceText = watch('sourceText');

  const handleGenerateFromText = async () => {
    if (!sourceText || sourceText.trim().length < 50) {
      setError('Please provide at least 50 characters of text to generate flashcards.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await api.generateFlashcardsFromText(sourceText);
      if (response.data) {
        // Replace existing cards with generated ones
        setValue('flashcards', response.data, { shouldValidate: true });
      }
    } catch (err) {
      setError('Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: DeckFormData) => {
    console.log('Submitting deck:', data);
    // Implement deck creation API call here
  };

  return (
    <Card className="max-w-4xl mx-auto" padding="large">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create a New Flashcard Deck
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Deck Details */}
        <div className="space-y-4">
          <Input
            label="Deck Title"
            {...register('title')}
            error={errors.title?.message}
            placeholder="e.g., Spanish Vocabulary, Biology Chapter 5"
            fullWidth
          />
          <Textarea
            label="Description (Optional)"
            {...register('description')}
            placeholder="A brief description of what this deck is about"
            fullWidth
          />
        </div>

        {/* Generation Mode Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <TabButton
            icon={LightBulbIcon}
            label="Generate from Text"
            isActive={generationMode === 'text'}
            onClick={() => setGenerationMode('text')}
          />
          <TabButton
            icon={PlusCircleIcon}
            label="Add Manually"
            isActive={generationMode === 'manual'}
            onClick={() => setGenerationMode('manual')}
          />
        </div>

        {/* Content Area */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={generationMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {generationMode === 'text' && (
                <div className="space-y-4">
                  <Textarea
                    label="Source Text"
                    {...register('sourceText')}
                    placeholder="Paste your notes, an article, or any text here. The AI will generate questions and answers based on this content."
                    rows={10}
                    fullWidth
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateFromText}
                    loading={isGenerating}
                    disabled={isGenerating || !sourceText}
                    icon={<SparklesIcon className="h-5 w-5" />}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Flashcards'}
                  </Button>
                  {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                </div>
              )}

              {generationMode === 'manual' && (
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ question: '', answer: '' })}
                    icon={<PlusCircleIcon className="h-5 w-5" />}
                  >
                    Add Card
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Flashcards List */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Flashcards ({fields.length})
          </h3>
          {errors.flashcards?.root && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.flashcards.root.message}</p>
          )}

          <AnimatePresence>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3, type: 'spring' }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Card {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Textarea
                    label="Question"
                    {...register(`flashcards.${index}.question`)}
                    error={errors.flashcards?.[index]?.question?.message}
                    placeholder="Enter the question"
                    rows={3}
                  />
                  <Textarea
                    label="Answer"
                    {...register(`flashcards.${index}.answer`)}
                    error={errors.flashcards?.[index]?.answer?.message}
                    placeholder="Enter the answer"
                    rows={3}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="submit" size="large">
            Create Deck
          </Button>
        </div>
      </form>
    </Card>
  );
};

interface TabButtonProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 -mb-px
      ${isActive
        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
      }
    `}
  >
    <Icon className="h-5 w-5 mr-2" />
    {label}
  </button>
);

export default FlashcardCreator;
