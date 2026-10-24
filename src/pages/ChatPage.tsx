import { FormEvent, useState, useEffect, useRef } from 'react';
import { askHsn } from '../services/chatApi';
import type { ChatMessage as Message } from '../types/chat';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { ChatMessage } from '../components/chat/ChatMessage';
import { HeroBanner } from '../components/chat/HeroBanner';
import { Composer } from '../components/chat/Composer';
import { INITIAL_WELCOME_MESSAGE } from '../constants/presets';

const STORAGE_KEY = 'ragchatbot_history';

export function ChatPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['cotton t-shirt', '01011010'];
    } catch {
      return ['cotton t-shirt', '01011010'];
    }
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: INITIAL_WELCOME_MESSAGE,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function addToHistory(query: string) {
    setSearchHistory(prev => {
      const updated = [query, ...prev.filter(item => item.toLowerCase() !== query.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }

  function clearHistory() {
    setSearchHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  function resetChat() {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'Started a fresh search session with RAGChatbot. Enter any product name or HSN code to find official tax classifications.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setError('');
  }

  async function handleSubmit(event?: FormEvent, queryOverride?: string) {
    event?.preventDefault();
    const message = (queryOverride ?? input).trim();
    if (message.length < 2 || loading) return;

    setError('');
    setInput('');
    addToHistory(message);

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(previous => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: 'user',
        text: message,
        timestamp: currentTime
      }
    ]);
    setLoading(true);

    try {
      const response = await askHsn(message);
      setMessages(previous => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: response.answer,
          results: response.results,
          disclaimer: response.disclaimer,
          method: response.method,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete the search. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onResetChat={resetChat}
        onSelectQuery={(query) => handleSubmit(undefined, query)}
        searchHistory={searchHistory}
        onClearHistory={clearHistory}
        loading={loading}
      />

      <section className="chat-panel">
        <Topbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onResetChat={resetChat}
        />

        <div className="chat-scroll">
          {messages.length === 1 && (
            <HeroBanner
              onSelectQuery={(query) => handleSubmit(undefined, query)}
              loading={loading}
            />
          )}

          <div className="messages-flow">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {loading && (
              <div className="loading-state">
                <div className="loading-avatar">RC</div>
                <div className="loading-card">
                  <div className="loading-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="loading-text">
                    Searching 21,921+ official HSN/SAC records and analyzing tax rates…
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="error-alert" role="alert">
                <span className="error-icon">⚠️</span>
                <div className="error-content">
                  <strong>Search Request Error</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        <Composer
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          loading={loading}
          onSelectChip={(chip) => handleSubmit(undefined, chip)}
        />
      </section>
    </div>
  );
}
