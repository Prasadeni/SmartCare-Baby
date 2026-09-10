import React, { useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(118, 182, 227, 0.2); border-color: #17648d; }
`;

export default function ChatbotUI() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! I'm SmartCare AI. How can I help you today? 💙" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { from: 'user', text: input }]);

    // Backend ready: POST to RAG chatbot endpoint
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: "Thanks for your question! Our team is working on connecting me to the AI backend. For now, please consult a specialist for medical concerns." }
      ]);
    }, 800);

    setInput('');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md flex flex-col pb-24 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-6 py-6 md:py-12 flex flex-col">
          <div className="text-center mb-6 animate-fade-in-up">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-1">SmartCare Assistant</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Ask anything about your baby's health</p>
          </div>

          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
            {/* Chat Area */}
            <div className="flex-1 bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow mb-4 overflow-y-auto animate-fade-in-up" style={{ animationDelay: '0.1s', maxHeight: '500px', minHeight: '400px' }}>
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-5 py-3 rounded-[1.5rem] font-body-md text-body-md ${m.from === 'user' ? 'bg-primary text-on-primary rounded-br-md' : 'bg-surface-container text-on-surface rounded-bl-md'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <input
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none input-glow transition-all soft-shadow"
              />
              <button type="submit" className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all soft-shadow shrink-0">
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}