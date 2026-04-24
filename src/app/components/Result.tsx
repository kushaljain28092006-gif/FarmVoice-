import { Volume2, ArrowLeft, Leaf, AlertCircle, Lightbulb, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

type Language = 'en' | 'hi' | 'mr';

interface ResultItem {
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

interface ResultProps {
  result: ResultItem | null;
  language: Language;
  onBack: () => void;
}

export function Result({ result, language, onBack }: ResultProps) {
  const { speak, stop, isPlaying } = useTextToSpeech();

  const content = {
    en: {
      yourQuery: 'Your Query',
      detected: 'Detected Issue',
      solution: 'Recommended Solution',
      tips: 'Additional Tips',
      playAudio: 'Play Audio',
      back: 'Back'
    },
    hi: {
      yourQuery: 'आपकी क्वेरी',
      detected: 'पहचानी गई समस्या',
      solution: 'अनुशंसित समाधान',
      tips: 'अतिरिक्त सुझाव',
      playAudio: 'ऑडियो चलाएं',
      back: 'वापस'
    },
    mr: {
      yourQuery: 'तुमची क्वेरी',
      detected: 'ओळखली गेलेली समस्या',
      solution: 'शिफारस केलेले समाधान',
      tips: 'अतिरिक्त सल्ले',
      playAudio: 'ऑडिओ प्ले करा',
      back: 'मागे'
    }
  };

  const t = content[language];

  // Auto-play the solution when a new result comes in
  useEffect(() => {
    if (result && result.result.solution) {
      speak(result.result.solution, language);
    }

    return () => {
      stop(); // Stop speaking if the component unmounts (e.g. user hits back)
    };
  }, [result, language, speak, stop]);

  if (!result) return null;

  const handlePlayAudio = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(result.result.solution, language);
    }
  };

  const handleBack = () => {
    stop();
    onBack();
  };

  return (
    <div className="result-screen">
      <motion.div
        className="result-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="result-header">
          <button onClick={handleBack} className="back-button glass-button">
            <ArrowLeft className="w-5 h-5" />
            <span>{t.back}</span>
          </button>

          <motion.button
            className="audio-button glass-button"
            onClick={handlePlayAudio}
            whileTap={{ scale: 0.95 }}
          >
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-[var(--nature-green)]' : ''}`} />
            <span>{t.playAudio}</span>
            {isPlaying && (
              <motion.div
                className="audio-wave"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              />
            )}
          </motion.button>
        </div>

        <motion.div
          className="query-card glass-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="query-label">{t.yourQuery}</p>
          <p className="query-text">{result.query}</p>
        </motion.div>

        <motion.div
          className="crop-badge"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Leaf className="w-5 h-5" />
          <span>{result.result.crop}</span>
        </motion.div>

        <motion.div
          className="problem-card glass-card card-accent-red"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header-inline">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h3>{t.detected}</h3>
          </div>
          <p className="problem-text">{result.result.problem}</p>
        </motion.div>

        <motion.div
          className="solution-card glass-card card-accent-green"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header-inline">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3>{t.solution}</h3>
          </div>
          <p className="solution-text">{result.result.solution}</p>
        </motion.div>

        <motion.div
          className="tips-card glass-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header-inline">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
            <h3>{t.tips}</h3>
          </div>
          <ul className="tips-list">
            {result.result.tips.map((tip, index) => (
              <motion.li
                key={index}
                className="tip-item"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <span className="tip-bullet">•</span>
                <span>{tip}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      <style>{`
        .result-screen {
          min-height: 100%;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .result-content {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-bottom: 2rem;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .back-button,
        .audio-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 16px;
          cursor: pointer;
          color: var(--foreground);
          font-weight: 600;
          position: relative;
          overflow: hidden;
        }

        .audio-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--nature-green), var(--nature-green-dark));
          transform-origin: left;
        }

        .query-card {
          padding: 1.25rem;
          border-radius: 20px;
        }

        .query-label {
          font-size: 0.875rem;
          color: var(--muted-foreground);
          margin-bottom: 0.5rem;
        }

        .query-text {
          font-size: 1.125rem;
          color: var(--foreground);
          font-weight: 500;
        }

        .crop-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, var(--nature-green-light), var(--earth-beige));
          border-radius: 16px;
          color: var(--nature-green-dark);
          font-weight: 600;
          align-self: flex-start;
          border: 2px solid var(--border);
        }

        .problem-card,
        .solution-card,
        .tips-card {
          padding: 1.5rem;
          border-radius: 24px;
        }

        .card-accent-red {
          border-left: 4px solid #ef4444;
        }

        .card-accent-green {
          border-left: 4px solid #22c55e;
        }

        .card-header-inline {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .card-header-inline h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--foreground);
          margin: 0;
        }

        .problem-text,
        .solution-text {
          font-size: 1rem;
          color: var(--foreground);
          line-height: 1.6;
        }

        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .tip-item {
          display: flex;
          gap: 0.75rem;
          color: var(--foreground);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        .tip-bullet {
          color: var(--nature-green);
          font-weight: 700;
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
}
