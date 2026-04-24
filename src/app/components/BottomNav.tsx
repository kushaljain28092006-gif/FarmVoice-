import { Home, History, User } from 'lucide-react';
import { motion } from 'motion/react';

type Screen = 'home' | 'listening' | 'result' | 'history' | 'profile';
type Language = 'en' | 'hi' | 'mr';

interface BottomNavProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  language: Language;
}

export function BottomNav({ currentScreen, setCurrentScreen, language }: BottomNavProps) {
  const navItems = [
    {
      id: 'home' as Screen,
      icon: Home,
      label: language === 'en' ? 'Home' : language === 'hi' ? 'होम' : 'मुख्य'
    },
    {
      id: 'history' as Screen,
      icon: History,
      label: language === 'en' ? 'History' : language === 'hi' ? 'इतिहास' : 'इतिहास'
    },
    {
      id: 'profile' as Screen,
      icon: User,
      label: language === 'en' ? 'Profile' : language === 'hi' ? 'प्रोफ़ाइल' : 'प्रोफाइल'
    }
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-content">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      <style>{`
        .bottom-nav {
          border-top: 1px solid var(--border);
          background: var(--card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 0.75rem 1rem 1.5rem;
          position: sticky;
          bottom: 0;
          z-index: 50;
        }

        .nav-content {
          max-width: 768px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .nav-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
          border-radius: 16px;
          background: transparent;
          border: none;
          color: var(--muted-foreground);
          cursor: pointer;
          transition: color 0.3s;
          overflow: hidden;
        }

        .nav-item:hover {
          color: var(--foreground);
        }

        .nav-item.active {
          color: var(--primary);
        }

        .active-indicator {
          position: absolute;
          inset: 0;
          background: var(--nature-green-light);
          border-radius: 16px;
          z-index: -1;
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          position: relative;
          z-index: 1;
        }

        .nav-label {
          font-size: 0.75rem;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }
      `}</style>
    </nav>
  );
}
