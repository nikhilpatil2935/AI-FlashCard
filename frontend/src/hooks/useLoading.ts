import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export const useLoading = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key: string): boolean => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  const clearAll = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    clearAll
  };
};
