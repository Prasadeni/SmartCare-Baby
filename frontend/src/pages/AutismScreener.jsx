// src/pages/AutismScreener.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { mchatApi } from '../api/assessments';

export default function AutismScreener() {
  const [searchParams] = useSearchParams();
  const babyId = searchParams.get('babyId');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // number -> true/false
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = await mchatApi.getQuestions();
      setQuestions(qs || []);
    } catch (err) {
      setError(err.message || 'Could not load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const progress = questions.length > 0
    ? ((current + 1) / questions.length) * 100
    : 0;

  const handleAnswer = (response) => {
    if (!questions[current]) return;
    const q = questions[current];
    setAnswers((prev) => ({ ...prev, [q.number]: response }));
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const handlePrevious = () => setCurrent((c) => Math.max(0, c - 1));

  const handleSubmit = async () => {
    if (!babyId) {
      alert('Please open a baby profile first, then start the screening.');
      return;
    }
    setSubmitting(true);
    try {
      const arr = questions.map((q) => ({
        questionNumber: q.number,
        response: answers[q.number] === true,
      }));
      const assessment = await mchatApi.submit(babyId, arr);
      navigate('/mchat-results', { state: { assessment, babyId } });
    } catch (err) {
      setError(err.message || 'Could not submit');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="bg-surface min-h-screen flex items-center justify-center">
          <LoadingSpinner label="Loading M-CHAT-R questions…" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-surface min-h-screen flex items-center justify-center">
          <ErrorState message={error} onRetry={load} />
        </div>
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <div className="bg-surface min-h-screen flex items-center justify-center">
          <ErrorState title="No questions available" message="Try again later." />
        </div>
      </>
    );
  }

  const q = questions[current];
  const currentAnswer = answers[q.number];
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col relative">

        <header className="w-full bg-surface-container-lowest shadow-[0_4px_20px_rgba(118,182,227,0.05)] sticky top-0 z-40">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                child_care
              </span>
              <span className="font-headline-md text-headline-md text-primary font-bold">
                SmartCare Baby
              </span>
            </div>
            <Link to={babyId ? `/baby/${babyId}` : '/dashboard'} className="flex items-center gap-1 text-outline hover:text-on-surface transition-colors">
              <span className="font-label-md text-label-md uppercase tracking-wider">Save & Exit</span>
              <span className="material-symbols-outlined">close</span>
            </Link>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center justify-center">
          <div className="text-center mb-8 w-full max-w-2xl">
            <h1 className="font-headline-xl text-headline-xl text-on-background mb-2">
              M-CHAT-R Screening
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Modified Checklist for Autism in Toddlers
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-[48px] shadow-[0_4px_20px_rgba(118,182,227,0.05)] w-full max-w-2xl overflow-hidden relative">

            <div className="bg-surface-container-low px-6 py-4 border-b border-surface-variant/30 flex flex-col gap-2">
              <div className="flex justify-between items-center w-full">
                <span className="font-label-md text-label-md text-primary tracking-widest uppercase">
                  Question {current + 1} of {questions.length}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-3 bg-surface-variant/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center mb-8">
                <span
                  className="material-symbols-outlined text-primary text-[40px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  child_care
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-background leading-tight mb-10 max-w-lg">
                {q.text}
              </h2>

              <div className="flex flex-col sm:flex-row w-full gap-4 justify-center mt-4">
                <button
                  onClick={() => handleAnswer(false)}
                  className={`flex-1 py-4 px-8 rounded-full border-2 font-headline-sm text-headline-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                    currentAnswer === false
                      ? 'bg-on-background text-on-primary border-on-background'
                      : 'bg-surface-container border-surface-variant hover:border-primary/30 text-on-background'
                  }`}
                >
                  <span className="material-symbols-outlined">close</span>
                  No
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className={`flex-1 py-4 px-8 rounded-full border-2 font-headline-sm text-headline-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
                    currentAnswer === true
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-primary text-on-primary border-primary'
                  }`}
                >
                  <span className="material-symbols-outlined">check</span>
                  Yes
                </button>
              </div>
            </div>

            <div className="px-6 py-4 bg-surface-container-lowest border-t border-surface-variant/20 flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={current === 0}
                className={`flex items-center gap-1 font-label-md text-label-md transition-colors px-4 py-2 rounded-full hover:bg-surface-container-low ${
                  current === 0 ? 'opacity-30 cursor-not-allowed' : 'text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                PREVIOUS
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                disabled={current === questions.length - 1}
                className="flex items-center gap-1 font-label-md text-label-md text-primary hover:text-surface-tint transition-colors px-4 py-2 rounded-full hover:bg-surface-container-low disabled:opacity-30"
              >
                SKIP
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Submit when all answered */}
          {allAnswered && (
            <div className="mt-6 w-full max-w-2xl">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 rounded-full bg-primary text-on-primary font-headline-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {submitting ? 'Scoring…' : 'Submit Screening'}
              </button>
            </div>
          )}

          <div className="mt-8 w-full max-w-2xl bg-secondary-container/20 border border-secondary-container rounded-3xl p-6 flex gap-4 items-start">
            <div className="mt-1 flex-shrink-0 w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                info
              </span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-secondary-container mb-1">
                Important Notice
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant/90 leading-relaxed">
                This screening tool (M-CHAT-R) is designed to assess risk for autism spectrum disorder (ASD) in toddlers.
                It is <strong className="font-bold text-on-background">not a diagnostic tool</strong>. A positive screening
                result does not mean your child has ASD. Always consult with your pediatrician.
              </p>
            </div>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}