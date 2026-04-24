import { useState, useCallback, useEffect } from 'react';

type Language = 'en' | 'hi' | 'mr';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      // Just requesting voices can trigger them to load in some browsers
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, language: Language) => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Map our app languages to BCP-47 language tags for SpeechSynthesis
    let targetLang = 'en-IN';
    switch (language) {
      case 'hi':
        targetLang = 'hi-IN';
        break;
      case 'mr':
        targetLang = 'mr-IN';
        break;
      case 'en':
      default:
        targetLang = 'en-IN'; // Indian English sounds more natural for this context
        break;
    }
    
    utterance.lang = targetLang;

    // Explicitly find and set a voice that matches the regional language
    // We do an aggressive search by language tag and name because browsers 
    // are inconsistent with their voice namings.
    const currentVoices = window.speechSynthesis.getVoices();
    let voice = undefined;
    
    if (language === 'hi') {
      voice = currentVoices.find(v => v.lang === 'hi-IN' || v.name.toLowerCase().includes('hindi') || v.lang.startsWith('hi'));
    } else if (language === 'mr') {
      voice = currentVoices.find(v => v.lang === 'mr-IN' || v.name.toLowerCase().includes('marathi') || v.lang.startsWith('mr'));
      if (!voice) {
        voice = currentVoices.find(v => v.lang === 'hi-IN' || v.name.toLowerCase().includes('hindi') || v.lang.startsWith('hi'));
      }
    } else {
      voice = currentVoices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.lang.startsWith('en'));
    }
                  
    if (voice) {
      utterance.voice = voice;
    }

    // Optional: tweak the voice params
    utterance.rate = 0.9; // slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    
    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error', e);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    isSupported
  };
}
