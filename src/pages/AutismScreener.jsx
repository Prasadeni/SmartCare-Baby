import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  .icon-fill { font-variation-settings: 'FILL' 1; }
`;

const mchatQuestions = [
  "Does your child enjoy being swung, bounced on your knee, etc.?",
  "Does your child take an interest in other children?",
  "Does your child like climbing on things?",
  "Does your child enjoy playing peek-a-boo or hide-and-seek?",
  "Does your child ever pretend?",
  "Does your child point with one finger to ask for something?",
  "Does your child point with one finger to show you something interesting?",
  "Does your child bring objects over to show you?",
  "Does your child look at your face to check your reaction?",
  "Does your child respond when you call their name?",
  "Does your child smile back at you?",
  "Does your child imitate you?",
  "Does your child use simple gestures?",
  "Does your child make eye contact?",
  "Does your child follow your gaze?",
  "Does your child try to get your attention?",
  "Does your child understand what you say?",
  "Does your child walk?",
  "Does your child copy actions?",
  "Does your child show interest in other children?"
];

export default function AutismScreener() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(20).fill(null));
  const navigate = useNavigate();

  const progress = ((currentQuestion + 1) / 20) * 100;

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < 19) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Backend ready: POST answers, then navigate
      console.log("Final Answers:", newAnswers);
      navigate('/mchat-results', { state: { answers: newAnswers } });
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col relative">

        {/* Simplified Header */}
        <header className="w-full bg-surface-container-lowest shadow-[0_4px_20px_rgba(118,182,227,0.05)] sticky top-0 z-40">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-headline-lg icon-fill">child_care</span>
              <span className="font-headline-md text-headline-md text-primary font-bold">SmartCare Baby</span>
            </div>
            <Link to="/dashboard" className="flex items-center gap-1 text-outline hover:text-on-surface transition-colors">
              <span className="font-label-md text-label-md uppercase tracking-wider">Save & Exit</span>
              <span className="material-symbols-outlined">close</span>
            </Link>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col items-center justify-center">
          <div className="text-center mb-8 w-full max-w-2xl">
            <h1 className="font-headline-xl text-headline-xl text-on-background mb-2">M-CHAT-R Screening</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Modified Checklist for Autism in Toddlers</p>
          </div>

          {/* Questionnaire Card */}
          <div className="bg-surface-container-lowest rounded-[48px] shadow-[0_4px_20px_rgba(118,182,227,0.05)] w-full max-w-2xl overflow-hidden relative">

            {/* Progress Header */}
            <div className="bg-surface-container-low px-6 py-4 border-b border-surface-variant/30 flex flex-col gap-2">
              <div className="flex justify-between items-center w-full">
                <span className="font-label-md text-label-md text-primary tracking-widest uppercase">
                  Question {currentQuestion + 1} of 20
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-surface-variant/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Area */}
            <div className="p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-primary text-[40px] icon-fill">child_care</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-background leading-tight mb-10 max-w-lg">
                {mchatQuestions[currentQuestion]}
              </h2>

              <div className="flex flex-col sm:flex-row w-full gap-4 justify-center mt-4">
                <button
                  onClick={() => handleAnswer('No')}
                  className="flex-1 py-4 px-8 rounded-full bg-surface-container border-2 border-surface-variant hover:border-primary/30 hover:bg-surface-container-high text-on-background font-headline-sm text-headline-sm transition-all shadow-sm flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">close</span>
                  No
                </button>
                <button
                  onClick={() => handleAnswer('Yes')}
                  className="flex-1 py-4 px-8 rounded-full bg-primary border-2 border-primary hover:bg-surface-tint text-on-primary font-headline-sm text-headline-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-on-primary">check</span>
                  Yes
                </button>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="px-6 py-4 bg-surface-container-lowest border-t border-surface-variant/20 flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                className={`flex items-center gap-1 font-label-md text-label-md transition-colors px-4 py-2 rounded-full hover:bg-surface-container-low ${
                  currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : 'text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                PREVIOUS
              </button>
              <button
                onClick={() => setCurrentQuestion(Math.min(19, currentQuestion + 1))}
                className="flex items-center gap-1 font-label-md text-label-md text-primary hover:text-surface-tint transition-colors px-4 py-2 rounded-full hover:bg-surface-container-low"
              >
                SKIP
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-8 w-full max-w-2xl bg-secondary-container/20 border border-secondary-container rounded-3xl p-6 flex gap-4 items-start shadow-[0_2px_10px_rgba(255,174,218,0.05)]">
            <div className="mt-1 flex-shrink-0 w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container icon-fill">info</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-secondary-container mb-1">Important Notice</h4>
              <p className="font-body-md text-body-md text-on-surface-variant/90 leading-relaxed">
                This screening tool (M-CHAT-R) is designed to assess risk for autism spectrum disorder (ASD) in toddlers. It is{' '}
                <strong className="font-bold text-on-background">not a diagnostic tool</strong>. A positive screening result does not mean
                your child has ASD, but rather that further evaluation is recommended. Always consult with your pediatrician.
              </p>
            </div>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}