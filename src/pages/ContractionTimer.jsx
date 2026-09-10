import React, { useState, useEffect } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
`;

export default function ContractionTimer() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [contractions, setContractions] = useState([]);

  useEffect(() => {
    let interval;
    if (isActive) interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = () => { setIsActive(true); setSeconds(0); };

  const handleStop = () => {
    setIsActive(false);
    setContractions([...contractions, { duration: formatTime(seconds), time: new Date().toLocaleTimeString() }]);
    // Backend ready: fetch('/api/contractions', { method: 'POST', body: JSON.stringify({ duration: seconds }) })
    setSeconds(0);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-1">Contraction Timer</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Track duration and frequency</p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 soft-shadow text-center mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-2">
                {isActive ? 'Contraction in progress...' : 'Ready when you are'}
              </p>
              <p className="text-headline-xl font-headline-xl text-secondary mb-8">{formatTime(seconds)}</p>

              <button
                onClick={isActive ? handleStop : handleStart}
                className={`w-full py-5 rounded-full font-headline-md text-headline-md transition-all active:scale-95 ${isActive ? 'bg-error text-on-error hover:opacity-90' : 'bg-secondary text-on-secondary hover:opacity-90'}`}
              >
                {isActive ? 'Stop Contraction' : 'Start Contraction'}
              </button>
            </div>

            {contractions.length > 0 && (
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Contraction Log ({contractions.length})</h3>
                <div className="flex flex-col gap-3">
                  {contractions.map((c, i) => (
                    <div key={i} className="flex justify-between items-center bg-surface-container rounded-xl px-4 py-3">
                      <span className="text-body-md font-body-md text-on-surface-variant">#{contractions.length - i} • {c.time}</span>
                      <span className="text-headline-sm font-headline-sm text-secondary">{c.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}