import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  LightBulbIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Generation',
      description: 'Create flashcards automatically from your text using advanced AI models'
    },
    {
      icon: AcademicCapIcon,
      title: 'Smart Study Sessions',
      description: 'Adaptive learning algorithms that focus on your weak areas'
    },
    {
      icon: ChartBarIcon,
      title: 'Progress Tracking',
      description: 'Detailed analytics to monitor your learning progress over time'
    },
    {
      icon: UserGroupIcon,
      title: 'Study Together',
      description: 'Share decks with friends and study collaboratively'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Smarter with{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                AI Flashcards
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Transform any text into intelligent flashcards and master your subjects faster than ever before
            </p>
            
            {user ? (
              <div className="space-x-4">
                <Link to="/dashboard">
                  <Button size="large" className="bg-white text-blue-600 hover:bg-gray-100">
                    Go to Dashboard
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/register">
                  <Button size="large" className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="large" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose AI Flashcards?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our intelligent platform combines the power of AI with proven learning techniques
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload Your Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Paste text, upload documents, or add content manually
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI Generates Cards
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI analyzes your content and creates intelligent flashcards
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Study & Learn
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use spaced repetition and adaptive learning to master your material
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Supercharge Your Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students already using AI to study more effectively
            </p>
            <Link to="/register">
              <Button size="large" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Learning Today
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
