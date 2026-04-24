import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Listening } from './components/Listening';
import { Result } from './components/Result';
import { History } from './components/History';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { generateFarmingAdvice } from '../utils/ai';

type Screen = 'home' | 'listening' | 'result' | 'history' | 'profile';
type Language = 'en' | 'hi' | 'mr';

interface HistoryItem {
  id: string;
  query: string;
  result: {
    crop: string;
    problem: string;
    solution: string;
    tips: string[];
  };
  timestamp: Date;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<HistoryItem | null>(null);

  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Global pointer up listener to stop listening when the user releases the hold
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (currentScreen === 'listening') {
        stopListening();
      }
    };
    
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [currentScreen, stopListening]);

  // Transition to Result when listening stops and we have a transcript
  useEffect(() => {
    let mounted = true;

    const processAI = async () => {
      if (!isListening && currentScreen === 'listening' && transcript) {
        // Fetch dynamic AI advice using the transcript
        const aiResult = await generateFarmingAdvice(transcript, language);

        if (!mounted) return;

        const historyItem: HistoryItem = {
          id: Date.now().toString(),
          query: transcript,
          result: aiResult,
          timestamp: new Date()
        };

        setCurrentResult(historyItem);
        setHistoryItems(prev => [historyItem, ...prev]);
        setCurrentScreen('result');
      } else if (!isListening && currentScreen === 'listening' && !transcript) {
        // If they released without saying anything, go back to home
        setCurrentScreen('home');
      }
    };

    processAI();

    return () => {
      mounted = false;
    };
  }, [isListening, currentScreen, transcript, language]);

  const handleStartListening = async () => {
    if (!navigator.onLine) {
      // Most browser speech recognition engines require internet.
      // Bypass the speech engine entirely when offline to prevent a network error crash.
      setCurrentScreen('listening');
      
      // Add a small delay to simulate processing before sliding to the result
      setTimeout(async () => {
        const aiResult = await generateFarmingAdvice("Offline Query", language);
        
        const historyItem: HistoryItem = {
          id: Date.now().toString(),
          query: language === 'en' ? '(Saved Query)' : language === 'hi' ? '(सहेजी गई क्वेरी)' : '(सेव्ह केलेली क्वेरी)',
          result: aiResult,
          timestamp: new Date()
        };

        setCurrentResult(historyItem);
        setHistoryItems(prev => [historyItem, ...prev]);
        setCurrentScreen('result');
      }, 1000);
      return;
    }

    setCurrentScreen('listening');
    
    // Map our language to BCP-47 for speech recognition
    const langCode = language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'mr-IN';
    startListening(langCode);
  };

  const handleImageUpload = async (base64: string, mimeType: string) => {
    setCurrentScreen('listening'); // Reusing the listening screen as a loading state
    
    const aiResult = await generateFarmingAdvice("", language, { base64, mimeType });
    
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      query: language === 'en' ? '📸 Image Analysis' : language === 'hi' ? '📸 छवि विश्लेषण' : '📸 प्रतिमा विश्लेषण',
      result: aiResult,
      timestamp: new Date()
    };

    setCurrentResult(historyItem);
    setHistoryItems(prev => [historyItem, ...prev]);
    setCurrentScreen('result');
  };

  const handleViewHistory = (item: HistoryItem) => {
    setCurrentResult(item);
    setCurrentScreen('result');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onStartListening={handleStartListening} onImageUpload={handleImageUpload} language={language} />;
      case 'listening':
        return <Listening isListening={isListening} language={language} transcript={transcript} />;
      case 'result':
        return <Result result={currentResult} language={language} onBack={() => setCurrentScreen('home')} />;
      case 'history':
        return <History items={historyItems} onViewItem={handleViewHistory} language={language} />;
      case 'profile':
        return (
          <div className="flex items-center justify-center h-full p-6">
            <div className="glass-card p-8 rounded-3xl text-center max-w-sm">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--nature-green)] to-[var(--nature-green-dark)] mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍🌾</span>
              </div>
              <h2 className="mb-2">
                {language === 'en' ? 'Farmer Profile' : language === 'hi' ? 'किसान प्रोफ़ाइल' : 'शेतकरी प्रोफाइल'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'en' ? 'Your farming companion' : language === 'hi' ? 'आपका खेती साथी' : 'तुमचा शेती साथी'}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Header
        isDark={isDark}
        setIsDark={setIsDark}
        language={language}
        setLanguage={setLanguage}
        currentScreen={currentScreen}
      />

      <main className="main-content">
        {renderScreen()}
      </main>

      <BottomNav
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        language={language}
      />

      <style>{`
        .app-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(circle at 20% 30%, var(--glow-primary) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, var(--glow-accent) 0%, transparent 50%),
            var(--background);
          overflow: hidden;
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          position: relative;
        }

        .glass-card {
          background: var(--card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .glass-button:active {
          transform: translateY(0);
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px var(--glow-primary), 0 0 40px var(--glow-primary);
          }
          50% {
            box-shadow: 0 0 40px var(--glow-primary), 0 0 60px var(--glow-primary);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

