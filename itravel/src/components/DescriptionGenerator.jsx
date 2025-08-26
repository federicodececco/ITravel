import { useState } from 'react';
import { OllamaService } from '../lib/ollama';

export default function DescriptionGenerator({
  onDescriptionGenerated,
  type = 'page',
  pageData = {},
  travelData = {},
  currentDescription = '',
  disabled = false,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleGenerate = async (customPrompt = '') => {
    if (!OllamaService.isEnabled()) {
      setError('Servizio AI non disponibile');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      let description;

      if (type === 'page') {
        description = await OllamaService.generatePageDescription({
          ...pageData,
          userPrompt: customPrompt || userPrompt,
        });
      }

      if (description) {
        onDescriptionGenerated(description);
        setShowPrompt(false);
        setUserPrompt('');
      }
    } catch (err) {
      console.error('Errore generazione:', err);
      setError('Errore durante la generazione. Riprova.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!OllamaService.isEnabled()) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3 flex-wrap'>
        <button
          type='button'
          onClick={() => setShowPrompt(!showPrompt)}
          disabled={disabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-medium text-sm ${
            disabled
              ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
              : 'bg-black text-[#e6d3b3] border-black hover:bg-gray-800 hover:shadow-md'
          }`}
        >
          <i className='fa-solid fa-magic'></i>
          <span>Genera con AI</span>
        </button>

        {currentDescription && (
          <button
            type='button'
            onClick={() => handleGenerate()}
            disabled={disabled || isGenerating}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm transition-all ${
              disabled || isGenerating
                ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                : 'bg-[#e6d3b3] text-black border-black hover:bg-[#d4c49a] hover:shadow-sm'
            }`}
          >
            {isGenerating ? (
              <>
                <div className='animate-spin rounded-full h-3 w-3 border-2 border-black border-t-transparent'></div>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <i className='fa-solid fa-refresh'></i>
                <span>Rigenera</span>
              </>
            )}
          </button>
        )}
      </div>

      {showPrompt && (
        <div className='bg-[#e6d3b3]/90 rounded-xl p-4 border-2 border-black space-y-4 backdrop-blur-sm'>
          <div>
            <label className='block text-lg font-semibold text-gray-800 mb-2'>
              Aggiungi dettagli personalizzati:
            </label>
            <p className='text-sm text-gray-600 mb-3'>
              Descrivi cosa hai fatto, come ti sei sentito, cosa ti ha colpito
              di più...
            </p>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Es: Abbiamo fatto una passeggiata al tramonto lungo il fiume, il cibo era delizioso e l'atmosfera molto romantica. La vista dalla collina era mozzafiato..."
              className='w-full px-4 py-3 border-2 border-black rounded-xl focus:border-gray-800 focus:outline-none text-base resize-none bg-white/80 '
              rows={4}
            />
          </div>

          {error && (
            <div className='bg-red-200 border-2 border-red-400 text-red-800 px-4 py-3 rounded-xl text-sm font-medium'>
              <i className='fa-solid fa-exclamation-triangle mr-2'></i>
              {error}
            </div>
          )}

          <div className='flex gap-3 flex-wrap'>
            <button
              type='button'
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                isGenerating
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed border-2 border-gray-400'
                  : 'bg-black text-[#e6d3b3] hover:bg-gray-800 hover:shadow-lg border-2 border-black'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-[#e6d3b3] border-t-transparent'></div>
                  <span>Generando descrizione...</span>
                </>
              ) : (
                <>
                  <i className='fa-solid fa-magic'></i>
                  <span>Genera Descrizione</span>
                </>
              )}
            </button>

            <button
              type='button'
              onClick={() => {
                setShowPrompt(false);
                setError('');
                setUserPrompt('');
              }}
              className='px-4 py-3 rounded-xl border-2 border-black text-black hover:bg-gray-300 transition-all font-medium text-base'
            >
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
