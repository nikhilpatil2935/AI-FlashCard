import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  PlusIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  BookOpenIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

// Temporary mock data - replace with real API calls
const mockStats = {
  totalDecks: 12,
  totalCards: 248,
  studyStreak: 7,
  hoursStudied: 23.5
};

const mockRecentDecks = [
  {
    id: '1',
    title: 'Spanish Vocabulary',
    description: 'Common Spanish words and phrases',
    cardCount: 45,
    lastStudied: '2 hours ago'
  },
  {
    id: '2', 
    title: 'Biology Terms',
    description: 'Cell biology and genetics terms',
    cardCount: 67,
    lastStudied: '1 day ago'
  },
  {
    id: '3',
    title: 'JavaScript Concepts',
    description: 'Core JS programming concepts',
    cardCount: 32,
    lastStudied: '3 days ago'
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [recentDecks, setRecentDecks] = useState(mockRecentDecks);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/create">
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 mr-4">
                  <PlusIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Deck
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Generate flashcards with AI
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/study">
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 mr-4">
                  <AcademicCapIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Study Session
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Practice your flashcards
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/progress">
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 mr-4">
                  <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    View Progress
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Track your learning stats
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="text-center">
              <BookOpenIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockStats.totalDecks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Decks
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <AcademicCapIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockStats.totalCards}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Cards
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <FireIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockStats.studyStreak}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Day Streak
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <ClockIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockStats.hoursStudied}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hours Studied
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Decks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Decks
              </h2>
              <Link to="/decks">
                <Button variant="outline" size="small">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentDecks.map((deck) => (
                <Card key={deck.id} className="hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {deck.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {deck.description}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{deck.cardCount} cards</span>
                        <span className="mx-2">•</span>
                        <span>Last studied {deck.lastStudied}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button size="small">
                        Study
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Study Recommendations */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Recommended Study
            </h2>
            
            <Card className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-blue-200 dark:border-blue-700">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-800 rounded-lg p-3 mr-4">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Review Due Cards
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    You have 23 cards ready for review
                  </p>
                </div>
                <Button size="small">
                  Start Review
                </Button>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 border-green-200 dark:border-green-700">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-800 rounded-lg p-3 mr-4">
                  <FireIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Keep Your Streak!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Study for 10 more minutes to maintain your 7-day streak
                  </p>
                </div>
                <Button size="small" variant="success">
                  Continue
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
