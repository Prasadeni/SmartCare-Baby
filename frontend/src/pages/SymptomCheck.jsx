// src/pages/SymptomCheck.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { symptomsApi } from '../api/assessments';
import { SYMPTOM_CATEGORIES } from '../utils/constants';

// Map category → icon
const CATEGORY_ICONS = {
  'General & Behavioral': 'psychology',
  'Respiratory': 'air',
  'Gastrointestinal': 'restaurant',
  'Neurological': 'neurology',
  'Fever & Infection': 'thermostat',
};

export default function SymptomCheck() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const babyId = searchParams.get('babyId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [configs, setConfigs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await symptomsApi.getConfigs();
      setConfigs(list || []);
    } catch (err) {
      setError(err.message || 'Could not load symptoms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleSymptom = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleSubmit = async () => {
    if (!babyId) {
      alert('Please select a baby first. Go to Babies → open a profile → Check Symptoms.');
      return;
    }
    setSubmitting(true);
    try {
      const answers = configs.map((c) => ({
        configId: c.id,
        present: selected.has(c.id),
      }));
      const assessment = await symptomsApi.submit(babyId, answers);
      navigate('/symptom-results', { state: { assessment, babyId } });
    } catch (err) {
      setError(err.message || 'Could not submit assessment');
      setSubmitting(false);
    }
  };

  const categories = ['All', ...SYMPTOM_CATEGORIES];
  const filtered = activeCategory === 'All'
    ? configs
    : configs.filter((c) => c.category === activeCategory);

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">

          {/* Progress indicator */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-label-md font-label-md text-on-surface-variant">Step 2 of 4</span>
              <span className="text-label-md font-label-md text-primary">Symptom Check</span>
            </div>
            <div className="h-[12px] bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-1/2 transition-all"></div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-headline-xl font-headline-xl text-primary mb-2">
              How is your baby feeling today?
            </h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Select any symptoms you've noticed. The system will score them and recommend next steps.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading symptoms…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : (
            <div className="flex flex-col md:flex-row gap-6">

              {/* Categories sidebar */}
              <aside className="w-full md:w-64 shrink-0">
                <div className="bg-surface-container-lowest rounded-2xl soft-shadow p-4 flex flex-col gap-2 sticky top-[100px]">
                  <h3 className="text-headline-sm font-headline-sm text-on-background px-2 mb-1">
                    Categories
                  </h3>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-full font-label-md text-label-md w-full justify-start transition-colors ${
                        activeCategory === cat
                          ? 'bg-surface-container-low text-primary'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      {cat !== 'All' && (
                        <span className="material-symbols-outlined text-lg">
                          {CATEGORY_ICONS[cat] || 'medical_services'}
                        </span>
                      )}
                      <span className="truncate">{cat}</span>
                    </button>
                  ))}
                </div>
              </aside>

              {/* Symptoms grid */}
              <div className="flex-1">
                {filtered.length === 0 ? (
                  <p className="text-center text-on-surface-variant py-12">No symptoms in this category.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {filtered.map((symptom) => {
                      const isSelected = selected.has(symptom.id);
                      return (
                        <button
                          key={symptom.id}
                          onClick={() => toggleSymptom(symptom.id)}
                          className={`bg-surface-container-lowest rounded-[2rem] p-5 soft-shadow transition-all flex flex-col items-center justify-center gap-3 text-center group h-44 relative ${
                            isSelected
                              ? 'border-2 border-primary bg-surface-container-low'
                              : 'border-2 border-transparent hover:border-primary-fixed'
                          }`}
                        >
                          {symptom.isRedFlag && (
                            <span className="absolute top-3 left-3 bg-error-container text-on-error-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              Red Flag
                            </span>
                          )}
                          {isSelected && (
                            <span className="absolute top-3 right-3">
                              <span
                                className="material-symbols-outlined text-primary text-xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                check_circle
                              </span>
                            </span>
                          )}
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-primary' : 'bg-surface-container-low group-hover:bg-primary-fixed'
                          }`}>
                            <span className={`material-symbols-outlined text-2xl ${
                              isSelected ? 'text-on-primary' : 'text-primary'
                            }`}>
                              {CATEGORY_ICONS[symptom.category] || 'medical_services'}
                            </span>
                          </div>
                          <span className="text-body-sm font-body-md text-on-background leading-snug line-clamp-2">
                            {symptom.symptomText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Emergency alert */}
                <div className="bg-error-container rounded-2xl p-5 flex items-start gap-4 mb-8">
                  <span className="material-symbols-outlined text-on-error-container text-3xl shrink-0 mt-1">info</span>
                  <div>
                    <h4 className="text-headline-sm font-headline-sm text-on-error-container mb-1">Emergency Alert</h4>
                    <p className="text-body-sm text-on-error-container opacity-90">
                      If you notice severe dehydration, breathing difficulty, or unresponsiveness, call emergency services immediately.
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-between items-center border-t border-outline-variant/30 pt-6">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-lowest transition-colors"
                  >
                    Cancel
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-label-md font-label-md text-on-surface-variant">
                      {selected.size} selected
                    </span>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-8 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:scale-95 disabled:opacity-60 transition-transform"
                    >
                      {submitting ? 'Analyzing…' : 'Get Results'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}