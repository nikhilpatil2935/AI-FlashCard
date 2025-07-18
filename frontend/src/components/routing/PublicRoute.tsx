import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean; // If true, redirects authenticated users
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  restricted = false 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If route is restricted and user is authenticated, redirect to dashboard
  if (restricted && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
