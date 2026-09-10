import React, { useState, useEffect } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes drawLine {
    from { stroke-dashoffset: 100; }
    to { stroke-dashoffset: 0; }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .animate-draw-line { stroke-dasharray: 100; stroke-dashoffset: 100; animation: drawLine 2.5s ease-out forwards; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(118, 182, 227, 0.2); border-color: #17648d; }
`;

export default function GrowthTracker() {
  const [formData, setFormData] = useState({ weight: '', height: '', head: '' });
  const [activeTab, setActiveTab] = useState('Weight');
  const [animateBars, setAnimateBars] = useState(false);

  // Backend Ready: Trigger animations after load
  useEffect(() => {
    const timer = setTimeout(() => setAnimateBars(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving new measurement:", formData);
    // Backend Ready: 
    // fetch('/api/growth', { method: 'POST', body: JSON.stringify(formData) })
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex flex-col font-body-md text-body-md bg-background antialiased">
        <DashboardNavbar activePage="babies" />

        <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-6">
          
          {/* Left Column: Data Entry & Percentiles */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            
            {/* Page Header */}
            <div className="animate-fade-in-up">
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">Growth Tracking</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">Monitor Leo's developmental milestones.</p>
            </div>

            {/* New Entry Form */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">New Entry</h3>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Weight (kg)</label>
                  <input 
                    name="weight" value={formData.weight} onChange={handleChange}
                    className="w-full bg-surface-bright border border-outline-variant rounded-full px-4 py-3 text-body-md font-body-md text-on-surface outline-none input-glow transition-all" 
                    placeholder="e.g. 6.5" step="0.1" type="number" required
                  />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Height (cm)</label>
                  <input 
                    name="height" value={formData.height} onChange={handleChange}
                    className="w-full bg-surface-bright border border-outline-variant rounded-full px-4 py-3 text-body-md font-body-md text-on-surface outline-none input-glow transition-all" 
                    placeholder="e.g. 62.0" step="0.5" type="number" required
                  />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Head Circumference (cm)</label>
                  <input 
                    name="head" value={formData.head} onChange={handleChange}
                    className="w-full bg-surface-bright border border-outline-variant rounded-full px-4 py-3 text-body-md font-body-md text-on-surface outline-none input-glow transition-all" 
                    placeholder="e.g. 41.5" step="0.1" type="number" required
                  />
                </div>
                <button type="submit" className="mt-4 w-full bg-primary text-on-primary rounded-full py-3 text-label-md font-label-md hover:scale-95 transition-transform duration-200">
                  Record Measurement
                </button>
              </form>
            </div>

            {/* Latest Percentiles */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Latest Percentiles</h3>
              <div className="flex flex-col gap-4">
                {/* Weight */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-body-sm font-body-sm text-on-surface-variant">Weight</span>
                    <span className="text-headline-sm font-headline-sm text-primary">55th</span>
                  </div>
                  <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className={`h-full bg-primary rounded-full transition-all duration-[2000ms] ease-out`} style={{ width: animateBars ? '55%' : '0%' }}></div>
                  </div>
                </div>
                {/* Height */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-body-sm font-body-sm text-on-surface-variant">Height</span>
                    <span className="text-headline-sm font-headline-sm text-primary">62nd</span>
                  </div>
                  <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className={`h-full bg-primary rounded-full transition-all duration-[2000ms] ease-out`} style={{ width: animateBars ? '62%' : '0%' }}></div>
                  </div>
                </div>
                {/* Head */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-body-sm font-body-sm text-on-surface-variant">Head Circumference</span>
                    <span className="text-headline-sm font-headline-sm text-secondary">50th</span>
                  </div>
                  <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className={`h-full bg-secondary rounded-full transition-all duration-[2000ms] ease-out`} style={{ width: animateBars ? '50%' : '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Chart & History */}
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            
            {/* Main Chart Area */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow flex-grow flex flex-col min-h-[400px] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-headline-sm font-headline-sm text-on-surface">Growth Progress</h3>
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('Weight')} className={`px-4 py-1 rounded-full font-label-md text-label-md transition-colors ${activeTab === 'Weight' ? 'bg-surface-container-high text-primary' : 'bg-surface-bright text-on-surface-variant border border-outline-variant hover:bg-surface-container-low'}`}>Weight</button>
                  <button onClick={() => setActiveTab('Height')} className={`px-4 py-1 rounded-full font-label-md text-label-md transition-colors ${activeTab === 'Height' ? 'bg-surface-container-high text-primary' : 'bg-surface-bright text-on-surface-variant border border-outline-variant hover:bg-surface-container-low'}`}>Height</button>
                </div>
              </div>
              
              {/* Chart Visualization Area */}
              <div className="flex-grow relative bg-surface-container-low rounded-lg border border-surface-dim overflow-hidden">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-8 px-4 pointer-events-none opacity-20">
                  <div className="border-b border-outline-variant w-full"></div>
                  <div className="border-b border-outline-variant w-full"></div>
                  <div className="border-b border-outline-variant w-full"></div>
                  <div className="border-b border-outline-variant w-full"></div>
                  <div className="border-b border-outline-variant w-full"></div>
                </div>
                
                {/* Percentile Band */}
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-primary-fixed opacity-30 rounded-t-[100%] ml-8 mr-8 transform scale-x-150"></div>
                
                {/* Animated Plot Line */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path 
                    d="M10,90 Q30,70 50,50 T90,20" 
                    fill="none" stroke="#17648d" strokeLinecap="round" strokeWidth="2" 
                    pathLength="100"
                    className="animate-draw-line" 
                  ></path>
                  <circle cx="10" cy="90" fill="#17648d" r="1.5"></circle>
                  <circle cx="50" cy="50" fill="#17648d" r="1.5"></circle>
                  <circle cx="90" cy="20" fill="#ffffff" r="2" stroke="#17648d" strokeWidth="1"></circle>
                </svg>

                {/* Labels */}
                <div className="absolute bottom-2 left-4 text-[10px] text-on-surface-variant font-label-md">Birth</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-label-md">3 Months</div>
                <div className="absolute bottom-2 right-4 text-[10px] text-on-surface-variant font-label-md">6 Months</div>
              </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-surface-container-lowest rounded-lg p-6 soft-shadow flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <div>
                  <h4 className="text-body-md font-body-md font-bold text-on-surface">Consistent Growth</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Leo is tracking beautifully along the 55th percentile curve for weight.</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-6 soft-shadow flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>info</span>
                </div>
                <div>
                  <h4 className="text-body-md font-body-md font-bold text-on-surface">Next Checkup</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Due for 6-month vaccinations next week.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}