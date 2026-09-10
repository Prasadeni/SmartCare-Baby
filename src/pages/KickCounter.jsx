import React, { useState, useEffect } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
`;

export default function KickCounter() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let interval;
    if (isRunning) interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setHistory([...history, { count, time: formatTime(elapsed), date: new Date().toLocaleString() }]);
      // Backend ready: fetch('/api/kicks', { method: 'POST', body: JSON.stringify({ count, duration: elapsed }) })
    } else {
      setIsRunning(true);
    }
  };

  const handleKick = () => setCount(count + 1);

  const handleReset = () => { setCount(0); setElapsed(0); setIsRunning(false); };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-1">Kick Counter</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Track your baby's movements</p>
          </div>

          <div className="max-w-lg mx-auto">
            {/* Timer Card */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 soft-shadow text-center mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-2">Session Time</p>
              <p className="text-headline-xl font-headline-xl text-primary mb-6">{formatTime(elapsed)}</p>

              <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center mb-6 transition-colors ${isRunning ? 'bg-secondary-container' : 'bg-surface-container'}`}>
                <p className="text-headline-xl font-headline-xl text-on-surface">{count}</p>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant mb-6">Kicks recorded</p>

              <div className="flex flex-col gap-3">
                <button onClick={handleKick} disabled={!isRunning} className={`w-full py-4 rounded-full font-headline-sm text-headline-sm transition-all ${isRunning ? 'bg-secondary text-on-secondary hover:opacity-90 active:scale-95' : 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'}`}>
                  + Record Kick
                </button>
                <button onClick={handleStartStop} className={`w-full py-4 rounded-full font-headline-sm text-headline-sm transition-all active:scale-95 ${isRunning ? 'bg-error text-on-error hover:opacity-90' : 'bg-primary text-on-primary hover:opacity-90'}`}>
                  {isRunning ? 'Stop Session' : 'Start Session'}
                </button>
                {!isRunning && elapsed > 0 && (
                  <button onClick={handleReset} className="w-full py-3 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors">Reset</button>
                )}
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Session History</h3>
                <div className="flex flex-col gap-3">
                  {history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center bg-surface-container rounded-xl px-4 py-3">
                      <div>
                        <p className="text-body-md font-body-md text-on-surface font-semibold">{h.count} kicks</p>
                        <p className="text-body-sm font-body-sm text-on-surface-variant">{h.date}</p>
                      </div>
                      <span className="text-headline-sm font-headline-sm text-secondary">{h.time}</span>
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