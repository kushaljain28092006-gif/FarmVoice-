import { Mic } from 'lucide-react';
import { motion } from 'motion/react';

type Language = 'en' | 'hi' | 'mr';

interface ListeningProps {
  isListening: boolean;
  language: Language;
  transcript: string;
}

export function Listening({ isListening, language, transcript }: ListeningProps) {
  const content = {
    en: {
      listening: 'Listening...',
      processing: 'Processing your query...',
      speak: 'Speak now'
    },
    hi: {
      listening: 'सुन रहा हूं...',
      processing: 'आपकी क्वेरी प्रोसेस हो रही है...',
      speak: 'अब बोलें'
    },
    mr: {
      listening: 'ऐकत आहे...',
      processing: 'तुमची क्वेरी प्रक्रिया करत आहे...',
      speak: 'आता बोला'
    }
  };

  const t = content[language];

  return (
    <div className="listening-screen">
      <motion.div
        className="listening-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mic-visualization"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="pulse-ring"
              animate={{
                scale: [1, 2, 2.5],
                opacity: [0.6, 0.3, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut'
              }}
            />
          ))}

          <motion.div
            className="mic-circle"
            animate={{
              scale: isListening ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: isListening ? Infinity : 0,
              ease: 'easeInOut'
            }}
          >
            <Mic className="mic-icon-listening" />
          </motion.div>
        </motion.div>

        <motion.div
          className="status-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="status-title">
            {isListening ? t.listening : t.processing}
          </h2>

          {isListening && (
            <motion.div
              className="waveform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="wave-bar"
                  animate={{
                    height: ['20px', '60px', '20px']
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        {(isListening || transcript) && (
          <motion.div
            className="transcript-box glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="transcript-label">{t.speak}</p>
            <motion.p
              className="transcript-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {transcript || "..."}
            </motion.p>
          </motion.div>
        )}

        {!isListening && (
          <motion.div
            className="processing-dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="dot"
                animate={{
                  y: [-8, 8, -8]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <style>{`
        .listening-screen {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          background:
            radial-gradient(circle at 50% 50%, var(--glow-primary) 0%, transparent 60%),
            var(--background);
        }

        .listening-content {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
        }

        .mic-visualization {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--nature-green);
          opacity: 0.6;
        }

        .mic-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--nature-green), var(--nature-green-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 40px var(--glow-primary);
          position: relative;
          z-index: 2;
        }

        .mic-icon-listening {
          width: 48px;
          height: 48px;
          color: white;
        }

        .status-container {
          text-align: center;
        }

        .status-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 1.5rem;
        }

        .waveform {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 80px;
        }

        .wave-bar {
          width: 6px;
          background: linear-gradient(180deg, var(--nature-green), var(--nature-green-dark));
          border-radius: 3px;
        }

        .transcript-box {
          width: 100%;
          padding: 1.5rem;
          border-radius: 24px;
          text-align: center;
        }

        .transcript-label {
          font-size: 0.875rem;
          color: var(--muted-foreground);
          margin-bottom: 0.75rem;
        }

        .transcript-text {
          font-size: 1.125rem;
          color: var(--foreground);
          font-weight: 500;
        }

        .processing-dots {
          display: flex;
          gap: 0.75rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--nature-green);
        }
      `}</style>
    </div>
  );
}

