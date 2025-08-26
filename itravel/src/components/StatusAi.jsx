import { useOllama } from '../hooks/useOllama';

export default function AIStatus({ className = '' }) {
  const { isEnabled, connectionStatus, checkConnection, isLoading } =
    useOllama();

  if (!isEnabled && connectionStatus === 'unknown') {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected'
            ? 'bg-green-500'
            : connectionStatus === 'disconnected'
              ? 'bg-red-500'
              : 'bg-yellow-500'
        }`}
      ></div>

      <span className='text-xs text-gray-600'>
        AI: {connectionStatus === 'connected' ? 'Attivo' : 'Non disponibile'}
      </span>

      {connectionStatus === 'disconnected' && (
        <button
          onClick={checkConnection}
          disabled={isLoading}
          className='text-xs text-blue-600 hover:text-blue-800 underline'
        >
          {isLoading ? 'Test...' : 'Riprova'}
        </button>
      )}
    </div>
  );
}
