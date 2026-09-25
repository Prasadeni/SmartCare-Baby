// src/pages/ChatbotUI.jsx
import React, { useEffect, useRef, useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import { chatApi } from '../api/chat';

export default function ChatbotUI() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // Create or resume session on mount
  useEffect(() => {
    async function init() {
      try {
        const session = await chatApi.createSession();
        setSessionId(session.id);
        const msgs = await chatApi.listMessages(session.id);
        setMessages(msgs || []);
      } catch (err) {
        setError(err.message || 'Could not start chat');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || !sessionId) return;

    // Optimistic: add user message immediately
    const tempUser = {
      id: `tmp_${Date.now()}`,
      sender: 'User',
      message: text,
    };
    setMessages((prev) => [...prev, tempUser]);
    setInput('');
    setSending(true);

    try {
      const { userMessage, botMessage } = await chatApi.sendMessage(sessionId, text);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUser.id),
        userMessage,
        botMessage,
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'Bot',
          message: `⚠️ ${err.message || 'Message failed. Try again.'}`,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = [
    'How much should my baby sleep?',
    'When to introduce solids?',
    'What is a normal kick count?',
    'Signs of dehydration in babies?',
  ];

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md flex flex-col pb-24 md:pb-0">
        <DashboardNavbar activePage="assistant" />

        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-1">
              SmartCare Assistant
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Ask anything about your baby's health
            </p>
          </div>

          {loading ? (
            <LoadingSpinner label="Starting chat…" />
          ) : error ? (
            <div className="max-w-2xl mx-auto text-center bg-error-container text-on-error-container rounded-2xl p-6">
              <p className="text-body-md">{error}</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
              {/* Chat area */}
              <div className="flex-1 bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow mb-4 overflow-y-auto min-h-[400px] max-h-[60vh]">
                <div className="flex flex-col gap-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-5 py-3 rounded-[1.5rem] text-body-md ${
                          m.sender === 'User'
                            ? 'bg-primary text-on-primary rounded-br-md'
                            : 'bg-surface-container text-on-surface rounded-bl-md'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-surface-container text-on-surface-variant px-5 py-3 rounded-[1.5rem] rounded-bl-md text-body-md flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="bg-surface-container hover:bg-surface-container-high transition-colors px-4 py-2 rounded-full text-label-md font-label-md text-on-surface-variant"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSend} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything…"
                  disabled={sending}
                  className="flex-1 rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md placeholder:text-outline focus:outline-none input-glow soft-shadow disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all soft-shadow shrink-0"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>

              {/* Disclaimer */}
              <p className="text-label-md text-on-surface-variant text-center mt-3">
                Not a substitute for medical advice. Consult a specialist for concerns.
              </p>
            </div>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}