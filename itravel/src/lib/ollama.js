const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_API_URL;
const MODEL_NAME = import.meta.env.VITE_OLLAMA_MODEL;
const AI_ENABLED = import.meta.env.VITE_AI_ENABLED;

export class OllamaService {
  static isEnabled() {
    return AI_ENABLED && OLLAMA_API_URL && MODEL_NAME;
  }

  static async generateDescription(prompt, options = {}) {
    try {
      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 300,
            ...options,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Errore nella generazione con Ollama:', error);
      throw error;
    }
  }
  static async generatePageDescription(pageData) {
    const { title, location, userPrompt = '', images = [] } = pageData;

    const basePrompt = `Scrivi una descrizione coinvolgente e dettagliata per una pagina di diario di viaggio.
    
Dettagli:
- Titolo: ${title}
- Luogo: ${location || 'non specificato'}
- Note dell'utente: ${userPrompt}
- Numero di foto: ${images.length}

Scrivi in prima persona come se fossi il viaggiatore. La descrizione deve essere:
- Emotiva e coinvolgente
- Tra 100-200 parole
- In italiano
- Ricca di dettagli sensoriali
- Che catturi l'essenza dell'esperienza

Descrizione:`;

    return this.generateDescription(basePrompt, { temperature: 0.8 });
  }

  static async testConnection() {
    if (!this.isEnabled()) {
      return { success: false, error: 'AI service not enabled' };
    }

    try {
      const response = await this.generateDescription(
        'Dimmi solo "Connessione OK" in italiano.',
        {
          temperature: 0,
          max_tokens: 10,
        },
      );

      return {
        success: true,
        message: 'Connessione stabilita con successo',
        model: MODEL_NAME,
        response: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
