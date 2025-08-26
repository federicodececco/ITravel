import { useState, useEffect } from 'react';
import { OllamaService } from '../lib/ollama';

export function useOllama() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const result = await OllamaService.testConnection();
      setIsEnabled(result.success);
      setConnectionStatus(result.success ? 'connected' : 'disconnected');
      if (!result.success) {
        console.warn('AI Service not available:', result.error);
      }
    } catch (err) {
      setIsEnabled(false);
      setConnectionStatus('disconnected');
      console.warn('AI Service connection failed:', err);
    }
  };

  const generateDescription = async (type, data, userPrompt = '') => {
    if (!isEnabled) {
      throw new Error('AI service not available');
    }

    setIsLoading(true);
    setError('');

    try {
      let result;

      if (type === 'page') {
        result = await OllamaService.generatePageDescription({
          ...data,
          userPrompt,
        });
      } else {
        throw new Error('Invalid generation type');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEnabled,
    isLoading,
    error,
    connectionStatus,
    generateDescription,
    checkConnection,
    clearError: () => setError(''),
  };
}
