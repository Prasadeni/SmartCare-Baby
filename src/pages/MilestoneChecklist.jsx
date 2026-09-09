import React, { useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
`;

export default function MilestoneChecklist() {
  const [activeTab, setActiveTab] = useState('Gross Motor');
  const [milestoneStatus, setMilestoneStatus] = useState({});

  const tabs = ['Gross Motor', 'Fine Motor', 'Language'];

  // Backend Ready: Structure this data dynamically later!
  const milestones = {
    'Gross Motor': [
      { id: 'sits_no_support', title: 'Sits without support', desc: 'Can sit independently for extended periods...', icon: 'accessibility_new' },
      { id: 'pulls_to_stand', title: 'Pulls to stand', desc: 'Uses furniture or support to pull themselves up...', icon: 'escalator_warning' },
      { id: 'crawls_hands_knees', title: 'Crawls on hands and knees', desc: 'Moves forward or backward efficiently...', icon: 'directions_walk' },
    ],
    'Fine Motor': [
      { id: 'grasps_objects', title: 'Grasps small objects', desc: 'Uses thumb and forefinger to pick up small items.', icon: 'back_hand' },
      { id: 'transfers_objects', title: 'Transfers objects', desc: 'Moves toys from one hand to the other smoothly.', icon: 'swap_horiz' },
    ],
    'Language': [
      { id: 'babbles', title: 'Babbles with intonation', desc: 'Makes sounds that sound like speech.', icon: 'record_voice_over' },
      { id: 'responds_name', title: 'Responds to name', desc: 'Looks or turns when their name is called.', icon: 'hearing' },
    ]
  };

  const setStatus = (id, status) => {
    setMilestoneStatus(prev => ({ ...prev, [id]: status }));
  };

  const getStatusColor = (id) => {
    if (milestoneStatus[id] === 'Achieved') return 'bg-primary text-on-primary hover:opacity-90';
    if (milestoneStatus[id] === 'Not yet') return 'bg-surface-variant text-on-surface-variant border-surface-variant';
    if (milestoneStatus[id] === 'Unsure') return 'bg-surface-container-low text-on-surface-variant';
    return 'bg-surface-container-high text-on-surface hover:bg-surface-variant';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md">
        <DashboardNavbar activePage="babies" />
        
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-headline-xl font-headline-xl text-on-surface mb-2">9-Month Milestones</h2>
                <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">Monitor your little one's growth...</p>
              </div>
              <span className="text-label-md font-label-md text-primary bg-primary-fixed px-3 py-1 rounded-full uppercase">Current Assessment</span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-headline-sm font-headline-sm text-on-surface">Screening Progress</span>
                <span className="text-headline-sm font-headline-sm text-primary">65%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: '65%' }}></div>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-2">You've completed 13 out of 20 questions for this month.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="flex gap-2 border-b border-surface-variant pb-2">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 text-headline-sm font-headline-sm transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {milestones[activeTab].map((item) => (
                  <div key={item.id} className="bg-surface-container-lowest rounded-xl p-6 soft-shadow flex flex-col justify-between h-full hover:-translate-y-1 transition-transform duration-300">
                    <div>
                      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-4 text-primary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      </div>
                      <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">{item.title}</h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">{item.desc}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setStatus(item.id, 'Achieved')} className={`w-full py-2 rounded-full text-label-md font-label-md flex items-center justify-center gap-2 transition-all ${getStatusColor(item.id)}`}>
                        <span className="material-symbols-outlined text-[16px]">check_circle</span> Achieved
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => setStatus(item.id, 'Not yet')} className={`flex-1 py-2 border-2 border-outline-variant rounded-full text-label-md font-label-md hover:bg-surface-variant transition-colors ${milestoneStatus[item.id] === 'Not yet' ? 'bg-surface-variant border-surface-variant text-on-surface-variant' : 'text-on-surface-variant'}`}>Not yet</button>
                        <button onClick={() => setStatus(item.id, 'Unsure')} className={`flex-1 py-2 border-2 border-outline-variant rounded-full text-label-md font-label-md hover:bg-surface-variant transition-colors ${milestoneStatus[item.id] === 'Unsure' ? 'bg-surface-variant border-surface-variant text-on-surface-variant' : 'text-on-surface-variant'}`}>Unsure</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4">Summary Preview</h3>
                <div className="flex items-center gap-2 bg-[#e8f5e9] px-4 py-2 rounded-full w-fit mb-6">
                  <span className="material-symbols-outlined text-[#2e7d32] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-label-md font-label-md text-[#2e7d32]">Progressing normally</span>
                </div>
                <div className="flex flex-col gap-4 mb-6">
                  {Object.keys(milestones).map(tab => (
                    <div key={tab} className="flex justify-between items-center py-2 border-b border-surface-container">
                      <span className="text-body-md font-body-md text-on-surface">{tab}</span>
                      <span className="text-label-md font-label-md text-primary bg-primary-fixed px-2 py-1 rounded-md">3/4 completed</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 border-b border-surface-container">
                    <span className="text-body-md font-body-md text-on-surface">Cognitive</span>
                    <span className="text-label-md font-label-md text-tertiary bg-tertiary-fixed px-2 py-1 rounded-md">Pending</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-primary text-on-primary rounded-full text-headline-sm font-headline-sm hover:opacity-90 transition-opacity active:scale-95 shadow-sm">View Detailed Report</button>
              </div>

              <div className="bg-secondary-fixed rounded-xl p-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary-container rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center mb-3 text-secondary">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <h4 className="text-headline-sm font-headline-sm text-on-surface mb-2">Need help?</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mb-4">Have questions about a milestone or concerned about progress? Chat with a pediatric nurse.</p>
                  <span className="text-label-md font-label-md text-secondary flex items-center gap-2">Start Chat <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
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