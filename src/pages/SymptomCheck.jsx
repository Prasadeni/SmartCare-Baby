import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
`;

const symptomData = [
  { id: 'reduced_appetite', title: 'Reduced appetite', icon: 'no_meals' },
  { id: 'spitting_up', title: 'Spitting up more', icon: 'water_drop' },
  { id: 'excessive_crying', title: 'Excessive crying', icon: 'record_voice_over' },
  { id: 'unusually_sleepy', title: 'Unusually sleepy', icon: 'bedtime' },
  { id: 'fussy_irritable', title: 'Fussy or Irritable', icon: 'sentiment_dissatisfied' },
];

const categories = [
  { id: 'feeding', title: 'Feeding', icon: 'restaurant', active: true },
  { id: 'activity', title: 'Activity', icon: 'directions_run', active: false },
  { id: 'physical', title: 'Physical', icon: 'thermostat', active: false },
  { id: 'mood', title: 'Mood', icon: 'mood_bad', active: false },
];

export default function SymptomCheck() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const navigate = useNavigate();

  const toggleSymptom = (id) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    console.log('Selected Symptoms:', selectedSymptoms);
    // Backend ready: Send this data to your API here
    // e.g., fetch('/api/symptom-check', { method: 'POST', body: JSON.stringify({ symptoms: selectedSymptoms }) })
    
    // Navigate to the results page and pass the selected symptoms
    navigate('/symptom-results', { state: { symptoms: selectedSymptoms } });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
        
        {/* Navbar with active tab marked as "babies" */}
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">
          
          {/* Progress Indicator */}
          <div className="mb-8 max-w-2xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-2">
              <span className="text-label-md font-label-md text-on-surface-variant">Step 2 of 4</span>
              <span className="text-label-md font-label-md text-primary">Symptom Check</span>
            </div>
            <div className="h-[12px] bg-surface-container-high rounded-full overflow-hidden flex">
              <div className="h-full bg-primary rounded-full w-1/2"></div>
            </div>
          </div>

          <div className="text-center mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-headline-xl font-headline-xl text-primary mb-2">How is your baby feeling today?</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Select any symptoms you've noticed to help us understand your baby's current state.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Categories Sidebar */}
            <aside className="w-full md:w-64 shrink-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-surface-container-lowest rounded-lg shadow-[0_4px_20px_rgba(118,182,227,0.05)] p-6 flex flex-col gap-3 sticky top-[100px]">
                <h3 className="text-headline-sm font-headline-sm text-on-background mb-2">Categories</h3>
                {categories.map(cat => (
                  <button key={cat.id} className={`flex items-center gap-3 px-4 py-3 rounded-full font-label-md text-label-md w-full justify-start text-left transition-colors ${cat.active ? 'bg-surface-container-low text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]' : 'text-on-surface-variant hover:bg-surface-container-lowest'}`}>
                    <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                    {cat.title}
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Content Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {symptomData.map((symptom, index) => {
                  const isSelected = selectedSymptoms.includes(symptom.id);
                  return (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`bg-surface-container-lowest rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)] transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center group h-48 relative overflow-hidden animate-fade-in-up ${
                        isSelected ? 'border-2 border-primary bg-surface-container-low' : 'border-2 border-transparent hover:border-primary-fixed'
                      }`}
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                      )}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-primary' : 'bg-surface-container-low group-hover:bg-primary-fixed'}`}>
                        <span className={`material-symbols-outlined text-3xl ${isSelected ? 'text-on-primary' : 'text-primary'}`}>{symptom.icon}</span>
                      </div>
                      <span className="text-headline-sm font-headline-sm text-on-background">{symptom.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Emergency Alert Box */}
              <div className="bg-error-container rounded-[2rem] p-6 flex items-start gap-4 mb-8 shadow-[0_4px_20px_rgba(118,182,227,0.05)] animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <span className="material-symbols-outlined text-on-error-container text-3xl shrink-0 mt-1">info</span>
                <div>
                  <h4 className="text-headline-sm font-headline-sm text-on-error-container mb-1">Emergency Alert</h4>
                  <p className="text-body-md font-body-md text-on-error-container opacity-90">
                    If you notice signs of severe dehydration (fewer wet diapers, no tears when crying, sunken fontanelle) or persistent high fever, please contact your pediatrician immediately.
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center border-t border-outline-variant/30 pt-6 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="px-12 py-3 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-lowest transition-colors"
                >
                  Skip for now
                </button>
                <button 
                  onClick={handleNext} 
                  className="px-12 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:scale-95 transition-transform duration-200 shadow-[0_4px_20px_rgba(118,182,227,0.1)]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}