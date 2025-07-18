import { useState, useCallback } from 'react';

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface Toast extends ToastOptions {
  id: string;
  timestamp: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();
    const duration = options.duration || 5000;

    const toast: Toast = {
      ...options,
      id,
      timestamp
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message: string, duration?: number) => {
    return showToast({ type: 'success', message, duration });
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    return showToast({ type: 'error', message, duration });
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    return showToast({ type: 'info', message, duration });
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return showToast({ type: 'warning', message, duration });
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    info,
    warning
  };
};
