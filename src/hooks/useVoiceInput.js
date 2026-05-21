import { useState, useRef, useCallback } from 'react';

/**
 * useVoiceInput — browser Web Speech API hook.
 * Returns { isListening, isSupported, startListening, stopListening, error }
 * onTranscript(text) is called with each final result (appended to existing value).
 */
export function useVoiceInput({ onTranscript, lang = 'en-AU' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice input is not supported in this browser. Please use Chrome or Safari.');
      return;
    }
    setError(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .filter(r => r.isFinal)
        .map(r => r[0].transcript)
        .join(' ');
      if (transcript && onTranscript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== 'aborted') {
        setError(`Voice error: ${e.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isSupported, onTranscript, lang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  return { isListening, isSupported, startListening, stopListening, toggle, error };
}