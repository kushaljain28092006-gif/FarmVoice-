import { Moon, Sun, Globe } from 'lucide-react';
import { motion } from 'motion/react';

type Language = 'en' | 'hi' | 'mr';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentScreen: string;
}

export function Header({ isDark, setIsDark, language, setLanguage, currentScreen }: HeaderProps) {
  const appName = language === 'en' ? 'FarmVoice' : language === 'hi' ? 'फार्मवॉयस' : 'फार्मव्हॉईस';

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' }
  ];

  return (
    <header className="header-container">
      <motion.div
        className="header-content"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="logo-icon">
            <span className="text-2xl">🌾</span>
          </div>
          <h1 className="app-title">{appName}</h1>
        </div>

        <div className="header-actions">
          <div className="language-selector glass-button">
            <Globe className="w-4 h-4" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="language-select"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="theme-toggle glass-button"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      <style>{`
        .header-container {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-content {
          max-width: 768px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--nature-green), var(--nature-green-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px var(--glow-primary);
        }

        .app-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--foreground);
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .language-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          color: var(--foreground);
        }

        .language-select {
          background: transparent;
          border: none;
          color: var(--foreground);
          font-weight: 500;
          cursor: pointer;
          outline: none;
          font-size: 0.875rem;
        }

        .theme-toggle {
          padding: 0.5rem;
          border-radius: 12px;
          color: var(--foreground);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      `}</style>
    </header>
  );
}
