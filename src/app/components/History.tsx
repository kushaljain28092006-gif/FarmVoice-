import { Clock, ChevronRight, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

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

interface HistoryProps {
  items: HistoryItem[];
  onViewItem: (item: HistoryItem) => void;
  language: Language;
}

export function History({ items, onViewItem, language }: HistoryProps) {
  const content = {
    en: {
      title: 'Query History',
      empty: 'No queries yet',
      emptyDesc: 'Your past queries will appear here',
      today: 'Today',
      yesterday: 'Yesterday',
      older: 'Older'
    },
    hi: {
      title: 'क्वेरी इतिहास',
      empty: 'अभी तक कोई क्वेरी नहीं',
      emptyDesc: 'आपकी पिछली क्वेरी यहां दिखाई देंगी',
      today: 'आज',
      yesterday: 'कल',
      older: 'पुराने'
    },
    mr: {
      title: 'क्वेरी इतिहास',
      empty: 'अद्याप कोणत्याही क्वेरी नाहीत',
      emptyDesc: 'तुमच्या मागील क्वेरी येथे दिसतील',
      today: 'आज',
      yesterday: 'काल',
      older: 'जुने'
    }
  };

  const t = content[language];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-screen">
      <motion.div
        className="history-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="history-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {t.title}
        </motion.h2>

        {items.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="empty-icon">
              <Clock className="w-16 h-16" />
            </div>
            <h3 className="empty-title">{t.empty}</h3>
            <p className="empty-description">{t.emptyDesc}</p>
          </motion.div>
        ) : (
          <motion.div
            className="history-list"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                className="history-item glass-card"
                onClick={() => onViewItem(item)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="item-content">
                  <div className="item-header">
                    <div className="crop-info">
                      <Leaf className="w-4 h-4 text-[var(--nature-green)]" />
                      <span className="crop-name">{item.result.crop}</span>
                    </div>
                    <span className="item-time">{formatTime(item.timestamp)}</span>
                  </div>

                  <p className="item-query">{item.query}</p>

                  <div className="item-footer">
                    <span className="problem-badge">{item.result.problem}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>

      <style>{`
        .history-screen {
          min-height: 100%;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .history-content {
          max-width: 600px;
          margin: 0 auto;
          padding-bottom: 2rem;
        }

        .history-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 1.5rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .empty-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--nature-green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--nature-green);
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .empty-description {
          color: var(--muted-foreground);
          font-size: 0.9375rem;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .history-item {
          padding: 1.25rem;
          border-radius: 20px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          border: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .item-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .crop-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .crop-name {
          font-weight: 600;
          color: var(--foreground);
          font-size: 0.9375rem;
        }

        .item-time {
          font-size: 0.8125rem;
          color: var(--muted-foreground);
        }

        .item-query {
          color: var(--foreground);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.5;
        }

        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .problem-badge {
          font-size: 0.8125rem;
          color: var(--muted-foreground);
          background: var(--muted);
          padding: 0.375rem 0.75rem;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
