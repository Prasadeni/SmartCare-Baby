import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  .custom-shadow-sm { box-shadow: 0 4px 20px -2px rgba(118, 182, 227, 0.08); }
  .custom-shadow-card { box-shadow: 0 10px 30px -4px rgba(118, 182, 227, 0.12); }
`;

// M-CHAT-R reverse-scored items (Yes = fail)
const REVERSE_ITEMS = [2, 5, 12];

export default function MChatResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers || [];

  // ---- Scoring ----
  const calculateScore = () => {
    let score = 0;
    answers.forEach((ans, idx) => {
      const qNum = idx + 1;
      const isReverse = REVERSE_ITEMS.includes(qNum);
      if (isReverse && ans === 'Yes') score++;
      if (!isReverse && ans === 'No') score++;
    });
    return score;
  };

  const score = calculateScore();
  const totalAnswered = answers.filter((a) => a !== null).length;
  const typicalResponses = totalAnswered - score;
  const monitoringResponses = score;

  // ---- Risk Level ----
  const getRisk = () => {
    if (score <= 2)
      return {
        level: 'Low Risk',
        sub: 'OPTIMAL RESULT',
        icon: 'sentiment_very_satisfied',
        ringColor: 'border-emerald-300',
        innerBg: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        subColor: 'text-emerald-600',
        message:
          "Your child's responses indicate a low likelihood of autism based on this screening.",
      };
    if (score <= 7)
      return {
        level: 'Medium Risk',
        sub: 'FOLLOW-UP RECOMMENDED',
        icon: 'sentiment_neutral',
        ringColor: 'border-amber-300',
        innerBg: 'bg-amber-50',
        textColor: 'text-amber-700',
        subColor: 'text-amber-600',
        message:
          "Some responses indicate a need for follow-up. Discuss these results with your pediatrician.",
      };
    return {
      level: 'High Risk',
      sub: 'SPECIALIST CONSULTATION',
      icon: 'emergency',
      ringColor: 'border-red-300',
      innerBg: 'bg-red-50',
      textColor: 'text-red-700',
      subColor: 'text-red-600',
      message:
        "Your child's responses indicate a higher likelihood of autism. Please consult a developmental specialist.",
    };
  };

  const risk = getRisk();

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md antialiased">
        <DashboardNavbar activePage="babies" />

        <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 md:px-6 py-8 md:py-10 space-y-8">
          {/* Breadcrumb + Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              <Link
                to="/dashboard"
                className="hover:text-primary flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Assessments
              </Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">M-CHAT-R Screening Result</span>
            </div>
            <div>
              <h1 className="text-headline-xl font-headline-xl text-on-surface">
                M-CHAT-R Screening Result
              </h1>
              <p className="text-body-md text-on-surface-variant mt-1">
                Here is a summary of your child's screening result.
              </p>
            </div>
          </div>

          {/* Baby Profile Card */}
          <div className="bg-surface-container-lowest rounded-xl p-5 md:p-6 border border-surface-variant custom-shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-xl bg-secondary-container/30 border-2 border-secondary-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    face_3
                  </span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center ring-2 ring-white">
                  <span className="material-symbols-outlined text-[12px]">check</span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-headline-md font-headline-md text-on-surface font-bold">Emma</h2>
                  <span className="px-3 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-label-md font-label-md">
                    18 months
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">event_available</span>
                  Assessment completed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-primary-fixed text-primary text-label-md font-label-md">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Screening Verified
            </div>
          </div>

          {/* Main Result Card */}
          <div className="bg-gradient-to-b from-surface to-surface-container-low rounded-[2rem] p-8 md:p-10 border border-primary-fixed custom-shadow-card flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/10 blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-secondary/10 blur-2xl pointer-events-none"></div>

            {/* Circular Indicator */}
            <div className={`relative w-44 h-44 rounded-full bg-white p-3 shadow-md border-4 ${risk.ringColor} flex items-center justify-center shrink-0`}>
              <div className={`w-full h-full rounded-full ${risk.innerBg} flex flex-col items-center justify-center text-center p-3`}>
                <span className={`material-symbols-outlined text-[32px] ${risk.textColor} mb-1`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {risk.icon}
                </span>
                <span className={`text-headline-md font-headline-md font-bold ${risk.textColor} leading-none`}>
                  {risk.level}
                </span>
                <span className={`text-[10px] font-label-md ${risk.subColor} mt-1.5 uppercase tracking-wider`}>
                  {risk.sub}
                </span>
              </div>
            </div>

            {/* Score + Message */}
            <div className="mt-6 max-w-xl space-y-2">
              <div className="inline-block px-4 py-1 rounded-full bg-white text-primary font-bold text-body-md border border-primary-fixed shadow-sm">
                M-CHAT-R Score: <span className="text-on-surface font-extrabold">{score} / 20</span>
              </div>
              <p className="text-body-lg font-body-lg font-bold text-on-surface leading-snug pt-2">
                {risk.message}
              </p>
              <p className="text-label-md text-on-surface-variant italic pt-1">
                This screening result is not a diagnosis.
              </p>
            </div>
          </div>

          {/* Screening Summary */}
          <div className="space-y-4">
            <h2 className="text-headline-md font-headline-md text-on-surface">Screening Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Answered */}
              <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-variant custom-shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <div className="text-headline-md font-headline-md font-bold text-on-surface">{totalAnswered}</div>
                  <div className="text-label-md text-on-surface-variant">Questions Answered</div>
                </div>
              </div>

              {/* Typical */}
              <div className="bg-surface-container-lowest rounded-xl p-5 border border-primary-fixed custom-shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                </div>
                <div>
                  <div className="text-headline-md font-headline-md font-bold text-on-surface">{typicalResponses}</div>
                  <div className="text-label-md text-on-surface-variant">Responses indicating typical development</div>
                </div>
              </div>

              {/* Monitoring */}
              <div className="bg-surface-container-lowest rounded-xl p-5 border border-amber-200 custom-shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                </div>
                <div>
                  <div className="text-headline-md font-headline-md font-bold text-on-surface">{monitoringResponses}</div>
                  <div className="text-label-md text-on-surface-variant">Responses to keep monitoring</div>
                </div>
              </div>
            </div>
          </div>

          {/* What does this mean? */}
          <div className="bg-primary-fixed/40 rounded-xl p-6 border border-primary-fixed flex items-start gap-4 custom-shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-headline-sm font-headline-sm text-primary font-bold">What does this mean?</h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                A {risk.level.toLowerCase()} result means that the responses provided during this screening did not indicate a high likelihood of autism. Continue to monitor your child's development and discuss any concerns with a healthcare professional.
              </p>
            </div>
          </div>

          {/* What can you do next? */}
          <div className="space-y-4">
            <h2 className="text-headline-md font-headline-md text-on-surface">What can you do next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Continue Monitoring */}
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-surface-variant custom-shadow-sm flex flex-col justify-between hover:border-primary transition">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>track_changes</span>
                  </div>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">Continue Monitoring</h3>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Keep observing your child's communication, social interaction, and development.
                  </p>
                </div>
                <Link
                  to="/milestones"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-primary text-on-primary font-bold text-body-sm hover:opacity-90 transition shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  View Development
                </Link>
              </div>

              {/* Talk to a Specialist */}
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-surface-variant custom-shadow-sm flex flex-col justify-between hover:border-secondary transition">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/40 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                  </div>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">Talk to a Specialist</h3>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    If you still have concerns about your child's development, consider speaking with a healthcare professional.
                  </p>
                </div>
                <Link
                  to="/specialists"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-secondary text-on-secondary font-bold text-body-sm hover:opacity-90 transition shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">stethoscope</span>
                  Find a Specialist
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-variant custom-shadow-sm flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/mchat')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-outline-variant bg-white hover:bg-surface-container-low text-on-surface font-bold text-body-sm transition shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              View Screening History
            </button>
            <button
              onClick={() => navigate('/mchat')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-outline-variant bg-white hover:bg-surface-container-low text-on-surface font-bold text-body-sm transition shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              Retake Screening
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-body-sm border-2 border-primary hover:opacity-90 transition shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download Report
            </button>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}