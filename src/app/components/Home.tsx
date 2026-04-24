import { Mic, Camera, Cloud, Droplets, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface HomeProps {
  onStartListening: () => void;
  onImageUpload?: (base64: string, mimeType: string) => void;
  language: Language;
}

export function Home({ onStartListening, onImageUpload, language }: HomeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const content = {
    en: {
      greeting: 'Hello Farmer!',
      subtitle: 'How can I help you today?',
      tapToSpeak: 'Tap to speak',
      orUpload: 'or upload image',
      weather: 'Weather Today',
      temp: '28°C',
      humidity: '65%',
      condition: 'Partly Cloudy',
      tip: "Today's Tip",
      tipText: 'Good day for spraying pesticides - low wind expected'
    },
    hi: {
      greeting: 'नमस्ते किसान!',
      subtitle: 'आज मैं आपकी कैसे मदद कर सकता हूं?',
      tapToSpeak: 'बोलने के लिए टैप करें',
      orUpload: 'या छवि अपलोड करें',
      weather: 'आज का मौसम',
      temp: '28°C',
      humidity: '65%',
      condition: 'आंशिक बादल',
      tip: 'आज की सलाह',
      tipText: 'कीटनाशक छिड़काव के लिए अच्छा दिन - कम हवा की उम्मीद'
    },
    mr: {
      greeting: 'नमस्कार शेतकरी!',
      subtitle: 'आज मी तुम्हाला कशी मदत करू शकतो?',
      tapToSpeak: 'बोलण्यासाठी टॅप करा',
      orUpload: 'किंवा प्रतिमा अपलोड करा',
      weather: 'आजचे हवामान',
      temp: '28°C',
      humidity: '65%',
      condition: 'अंशतः ढगाळ',
      tip: 'आजचा सल्ला',
      tipText: 'कीटकनाशके फवारण्यासाठी चांगला दिवस - कमी वारा अपेक्षित'
    }
  };

  const t = content[language];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onImageUpload(base64, file.type);
    };
    reader.readAsDataURL(file);
    
    // Reset the input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="home-screen">
      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="greeting-section">
          <motion.h2
            className="greeting"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t.greeting}
          </motion.h2>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>
        </div>

        <motion.div
          className="mic-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          <motion.button
            className="mic-button animate-pulse-glow"
            onPointerDown={onStartListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="mic-pulse"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <Mic className="mic-icon" />
          </motion.button>
          <p className="tap-label">{t.tapToSpeak}</p>
        </motion.div>

        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        
        <motion.button
          className="upload-button glass-button"
          onClick={triggerUpload}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Camera className="w-5 h-5" />
          <span>{t.orUpload}</span>
        </motion.button>

        <div className="info-cards">
          <motion.div
            className="weather-card glass-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="card-header">
              <Cloud className="w-5 h-5 text-[var(--nature-green)]" />
              <h3 className="card-title">{t.weather}</h3>
            </div>
            <div className="weather-info">
              <div className="weather-main">
                <Sun className="w-8 h-8 text-yellow-500" />
                <span className="temp">{t.temp}</span>
              </div>
              <div className="weather-details">
                <div className="detail">
                  <Droplets className="w-4 h-4" />
                  <span>{t.humidity}</span>
                </div>
                <span className="condition">{t.condition}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="tip-card glass-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="card-header">
              <span className="text-xl">💡</span>
              <h3 className="card-title">{t.tip}</h3>
            </div>
            <p className="tip-text">{t.tipText}</p>
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        .home-screen {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1.5rem;
        }

        .home-content {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .greeting-section {
          text-align: center;
        }

        .greeting {
          font-size: 2rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--muted-foreground);
          font-size: 1rem;
        }

        .mic-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .mic-button {
          position: relative;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--nature-green), var(--nature-green-dark));
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px var(--glow-primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mic-pulse {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: var(--nature-green);
        }

        .mic-icon {
          width: 56px;
          height: 56px;
          color: white;
          position: relative;
          z-index: 1;
        }

        .tap-label {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--foreground);
        }

        .upload-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 20px;
          font-weight: 600;
          color: var(--foreground);
          cursor: pointer;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .weather-card,
        .tip-card {
          padding: 1.25rem;
          border-radius: 24px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--foreground);
          margin: 0;
        }

        .weather-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .weather-main {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .temp {
          font-size: 2rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .weather-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-end;
        }

        .detail {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--muted-foreground);
          font-size: 0.875rem;
        }

        .condition {
          font-size: 0.875rem;
          color: var(--muted-foreground);
        }

        .tip-text {
          color: var(--foreground);
          font-size: 0.9375rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
