import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(118, 182, 227, 0.2); border-color: #17648d; }
`;

// ==========================================
// HELPER: Calculate pregnancy stats from LMP
// ==========================================
function calculateFromLMP(lmpDateStr) {
  if (!lmpDateStr) return null;

  const lmpDate = new Date(lmpDateStr);
  const today = new Date();
  lmpDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Days since LMP
  const daysSinceLMP = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));

  // Pregnancy duration = 280 days (40 weeks)
  const daysToGo = Math.max(0, 280 - daysSinceLMP);
  const currentWeek = Math.max(1, Math.min(40, Math.floor(daysSinceLMP / 7)));
  const currentDay = daysSinceLMP % 7;

  // Due date = LMP + 280 days
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280);

  // Trimester
  let trimester = '1st Trimester';
  if (currentWeek >= 13 && currentWeek < 28) trimester = '2nd Trimester';
  else if (currentWeek >= 28) trimester = '3rd Trimester';

  // Baby size by week
  const sizeMap = {
    4: 'Poppy Seed', 5: 'Sesame Seed', 6: 'Lentil', 7: 'Blueberry',
    8: 'Raspberry', 9: 'Grape', 10: 'Strawberry', 11: 'Fig',
    12: 'Lime', 13: 'Peach', 14: 'Lemon', 15: 'Apple',
    16: 'Avocado', 17: 'Pear', 18: 'Bell Pepper', 19: 'Mango',
    20: 'Banana', 21: 'Carrot', 22: 'Papaya', 23: 'Grapefruit',
    24: 'Cantaloupe', 25: 'Cauliflower', 26: 'Lettuce', 27: 'Cabbage',
    28: 'Eggplant', 29: 'Butternut Squash', 30: 'Cucumber', 31: 'Coconut',
    32: 'Squash', 33: 'Pineapple', 34: 'Cantaloupe', 35: 'Honeydew',
    36: 'Romaine Lettuce', 37: 'Swiss Chard', 38: 'Leek',
    39: 'Mini Watermelon', 40: 'Watermelon'
  };
  const weekKey = Math.max(4, Math.min(40, currentWeek));
  const babySize = sizeMap[weekKey] || 'Growing';

  return {
    lmpDate: lmpDateStr,
    dueDate: dueDate.toISOString().split('T')[0],
    daysSinceLMP,
    daysToGo,
    currentWeek,
    currentDay,
    trimester,
    babySize,
  };
}

// ==========================================
// HELPER: Calculate from direct due date
// ==========================================
function calculateFromDueDate(dueDateStr) {
  if (!dueDateStr) return null;

  const dueDate = new Date(dueDateStr);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysToGo = Math.max(0, Math.floor((dueDate - today) / (1000 * 60 * 60 * 24)));
  const daysSinceLMP = 280 - daysToGo;

  // LMP = due date - 280 days
  const lmpDate = new Date(dueDate);
  lmpDate.setDate(lmpDate.getDate() - 280);

  const currentWeek = Math.max(1, Math.min(40, Math.floor(daysSinceLMP / 7)));
  const currentDay = daysSinceLMP % 7;

  let trimester = '1st Trimester';
  if (currentWeek >= 13 && currentWeek < 28) trimester = '2nd Trimester';
  else if (currentWeek >= 28) trimester = '3rd Trimester';

  const sizeMap = {
    4: 'Poppy Seed', 5: 'Sesame Seed', 6: 'Lentil', 7: 'Blueberry',
    8: 'Raspberry', 9: 'Grape', 10: 'Strawberry', 11: 'Fig',
    12: 'Lime', 13: 'Peach', 14: 'Lemon', 15: 'Apple',
    16: 'Avocado', 17: 'Pear', 18: 'Bell Pepper', 19: 'Mango',
    20: 'Banana', 21: 'Carrot', 22: 'Papaya', 23: 'Grapefruit',
    24: 'Cantaloupe', 25: 'Cauliflower', 26: 'Lettuce', 27: 'Cabbage',
    28: 'Eggplant', 29: 'Butternut Squash', 30: 'Cucumber', 31: 'Coconut',
    32: 'Squash', 33: 'Pineapple', 34: 'Cantaloupe', 35: 'Honeydew',
    36: 'Romaine Lettuce', 37: 'Swiss Chard', 38: 'Leek',
    39: 'Mini Watermelon', 40: 'Watermelon'
  };
  const weekKey = Math.max(4, Math.min(40, currentWeek));
  const babySize = sizeMap[weekKey] || 'Growing';

  return {
    lmpDate: lmpDate.toISOString().split('T')[0],
    dueDate: dueDateStr,
    daysSinceLMP,
    daysToGo,
    currentWeek,
    currentDay,
    trimester,
    babySize,
  };
}

export default function PregnancyDashboard() {
  // ==========================================
  // STATE
  // ==========================================
  const [pregnancy, setPregnancy] = useState({
    lmpDate: '',
    dueDate: '',
    currentWeek: 0,
    currentDay: 0,
    daysSinceLMP: 0,
    daysToGo: 0,
    trimester: '1st Trimester',
    babySize: 'Poppy Seed',
    todayKicks: 0,
    weightStatus: 'On Track',
    isSetup: false,
  });

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [inputMethod, setInputMethod] = useState('lmp'); // 'lmp' or 'due'
  const [formData, setFormData] = useState({ lmpDate: '', dueDate: '' });

  // ==========================================
  // SUBMIT — Calculate and Save
  // ==========================================
  const handleSetupSubmit = (e) => {
    e.preventDefault();

    let calculated = null;
    if (inputMethod === 'lmp' && formData.lmpDate) {
      calculated = calculateFromLMP(formData.lmpDate);
    } else if (inputMethod === 'due' && formData.dueDate) {
      calculated = calculateFromDueDate(formData.dueDate);
    }

    if (calculated) {
      setPregnancy((prev) => ({ ...prev, ...calculated, isSetup: true }));
      // BACKEND READY:
      // fetch('/api/pregnancy', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(calculated)
      // })
    }

    setShowSetupModal(false);
  };

  const isSetup = pregnancy.isSetup;

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden pb-32 md:pb-0">

        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">

          {/* ==========================================
              EMPTY STATE — No pregnancy added yet
          ========================================== */}
          {!isSetup ? (
            <div className="flex items-center justify-center min-h-[70vh] animate-fade-in-up">
              <div className="max-w-lg mx-auto bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 soft-shadow text-center">

                {/* Hero Icon */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary-container flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-secondary text-5xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    pregnant_woman
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-headline-lg font-headline-lg text-primary mb-3">
                  Start Your Pregnancy Journey
                </h2>
                <p className="text-body-lg font-body-lg text-on-surface-variant mb-8 max-w-md mx-auto">
                  Add your pregnancy details to begin tracking your baby's growth week by week.
                </p>

                {/* Info list */}
                <div className="bg-surface-container-low rounded-xl p-5 mb-8 text-left">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary text-xl shrink-0">check_circle</span>
                    <span className="text-body-md text-on-surface-variant">See your baby's size week by week</span>
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary text-xl shrink-0">check_circle</span>
                    <span className="text-body-md text-on-surface-variant">Track kick counts and contractions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl shrink-0">check_circle</span>
                    <span className="text-body-md text-on-surface-variant">Log your weight progress</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    setInputMethod('lmp');
                    setFormData({ lmpDate: '', dueDate: '' });
                    setShowSetupModal(true);
                  }}
                  className="w-full md:w-auto bg-secondary text-on-secondary font-headline-sm text-headline-sm py-4 px-8 rounded-full hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto shadow-md"
                >
                  <span className="material-symbols-outlined">add</span>
                  Add Pregnancy
                </button>
              </div>
            </div>
          ) : (
            /* ==========================================
               MAIN DASHBOARD — After pregnancy is added
            ========================================== */
            <>
              {/* Header */}
              <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 animate-fade-in-up">
                <div>
                  <h2 className="text-headline-lg-mobile md:text-headline-xl font-headline-xl text-primary mb-2">
                    Your Pregnancy Journey
                  </h2>
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <span className="text-headline-sm font-headline-sm">
                      Week {pregnancy.currentWeek}, Day {pregnancy.currentDay}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span className="text-body-lg font-body-lg">{pregnancy.daysToGo} Days to Go</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setInputMethod('lmp');
                    setFormData({
                      lmpDate: pregnancy.lmpDate || '',
                      dueDate: pregnancy.dueDate || '',
                    });
                    setShowSetupModal(true);
                  }}
                  className="bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-full hover:bg-surface-tint transition-colors flex items-center gap-2 shadow-sm self-start md:self-auto"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Update Details
                </button>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 flex flex-col gap-6">

                  {/* Journey Progress Card */}
                  <section className="bg-surface-container-lowest rounded-xl p-6 soft-shadow border border-surface-variant animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-headline-sm font-headline-sm text-primary mb-6">Journey Progress</h3>

                    <div className="relative pt-6 pb-2">
                      <div className="absolute h-3 w-full bg-surface-container-high rounded-full top-1/2 -translate-y-1/2"></div>
                      <div
                        className="absolute h-3 bg-primary rounded-full top-1/2 -translate-y-1/2 transition-all duration-1000"
                        style={{ width: `${Math.min(100, (pregnancy.currentWeek / 40) * 100)}%` }}
                      ></div>

                      <div className="relative flex justify-between items-center w-full z-10">
                        <div className="flex flex-col items-center transform -translate-x-1/2 left-0 absolute">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-[14px] text-on-primary">check</span>
                          </div>
                          <span className="text-label-md font-label-md text-primary mt-2 whitespace-nowrap">1st Trimester</span>
                        </div>

                        <div className="flex flex-col items-center transform -translate-x-1/2 left-1/3 absolute">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${pregnancy.currentWeek >= 13 ? 'bg-primary' : 'bg-surface-container-high border-2 border-surface-variant'}`}>
                            {pregnancy.currentWeek >= 13 && (
                              <span className="material-symbols-outlined text-[14px] text-on-primary">check</span>
                            )}
                          </div>
                          <span className="text-label-md font-label-md text-primary mt-2 whitespace-nowrap">2nd Trimester</span>
                        </div>

                        <div
                          className="flex flex-col items-center transform -translate-x-1/2 absolute"
                          style={{ left: `${Math.min(100, (pregnancy.currentWeek / 40) * 100)}%` }}
                        >
                          <div className="w-8 h-8 rounded-full bg-surface-container-lowest border-4 border-primary flex items-center justify-center shadow-md">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                          </div>
                          <span className="text-label-md font-label-md text-primary mt-2 font-bold whitespace-nowrap">
                            Week {pregnancy.currentWeek}
                          </span>
                        </div>

                        <div className="flex flex-col items-center transform translate-x-1/2 right-0 absolute">
                          <div className="w-6 h-6 rounded-full bg-surface-container-high border-2 border-surface-variant flex items-center justify-center shadow-sm"></div>
                          <span className="text-label-md font-label-md text-on-surface-variant mt-2 whitespace-nowrap">Due Date</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-start gap-4 p-4 bg-surface-container-low rounded-lg">
                      <span className="material-symbols-outlined text-primary text-3xl">child_friendly</span>
                      <div>
                        <h4 className="text-body-lg font-bold text-on-surface">
                          Baby is the size of a {pregnancy.babySize}!
                        </h4>
                        <p className="text-body-md text-on-surface-variant mt-1">
                          {pregnancy.trimester} • Due {new Date(pregnancy.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Feature Cards */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/kick-counter" className="bg-surface-container-lowest rounded-xl p-6 soft-shadow border border-surface-variant flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined text-on-primary-fixed text-2xl">footprint</span>
                        </div>
                        <span className="bg-primary-container/20 text-on-primary-container px-3 py-1 rounded-full text-label-md font-label-md">
                          Today: {pregnancy.todayKicks} Kicks
                        </span>
                      </div>
                      <div>
                        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">Kick Counter</h3>
                        <p className="text-body-sm text-on-surface-variant">Track your baby's daily movements.</p>
                      </div>
                    </Link>

                    <Link to="/weight-logger" className="bg-surface-container-lowest rounded-xl p-6 soft-shadow border border-surface-variant flex flex-col justify-between hover:bg-secondary-fixed transition-colors cursor-pointer group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-secondary-fixed-dim flex items-center justify-center group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined text-on-secondary-fixed text-2xl">monitor_weight</span>
                        </div>
                        <span className="bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full text-label-md font-label-md">
                          {pregnancy.weightStatus}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">Weight Tracker</h3>
                        <p className="text-body-sm text-on-surface-variant">Log your weekly weight progress.</p>
                      </div>
                    </Link>

                    <Link to="/contraction-timer" className="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-xl p-6 soft-shadow border border-surface-variant flex flex-col sm:flex-row items-center sm:justify-between gap-4 hover:bg-surface-container-low transition-colors group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined text-on-tertiary-fixed text-3xl">timer</span>
                        </div>
                        <div>
                          <h3 className="text-headline-sm font-headline-sm text-on-surface">Contraction Timer</h3>
                          <p className="text-body-sm text-on-surface-variant">Ready for when the time comes.</p>
                        </div>
                      </div>
                      <span className="w-full sm:w-auto bg-surface text-primary border-2 border-primary hover:bg-surface-container-high px-6 py-2 rounded-full font-label-md text-label-md transition-colors whitespace-nowrap text-center">
                        Open Timer
                      </span>
                    </Link>
                  </section>
                </div>

                {/* Right: Tip of the Week */}
                <div className="md:col-span-4 flex flex-col gap-6">
                  <section className="bg-secondary-fixed rounded-xl p-6 soft-shadow overflow-hidden relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-10 rounded-bl-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-secondary">lightbulb</span>
                        <h3 className="text-headline-sm font-headline-sm text-on-surface">Tip of the Week</h3>
                      </div>
                      <div className="h-40 w-full rounded-lg mb-4 bg-surface-variant overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          alt="Healthy prenatal meal"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOQ1IyewigIw0dCiNZx0zPoJocv72lkDH62Ok3f1kyTbZl9I3lHe2sKkcfycoJuwrfBK6GFWyS4OIjVzeDuYYV_LQRySy7wMq9l4dxIQM8yBhhN2VIufQbYAj_zZYFQD6rlIogMla8FRLSr0MoapQa19KzOL0MtjX10bG0yUz8mwTQgTV3tbBfPlYMUyi7tUx1IV7RaWNFlpnYWEs63QG1vVcYRFdfMGh-uKCbm-4bQIIrnx6jSpYS"
                        />
                      </div>
                      <h4 className="text-body-lg font-bold text-on-surface mb-2">Staying Hydrated & Nourished</h4>
                      <p className="text-body-md text-on-surface-variant mb-4">
                        Focus on calcium-rich foods and drinking at least 8-10 glasses of water daily to support amniotic fluid levels.
                      </p>
                      <button className="text-secondary font-label-md text-label-md flex items-center gap-1 hover:opacity-80 transition-opacity">
                        Read Full Article
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}
        </main>

        {/* ==========================================
            SETUP MODAL
        ========================================== */}
        {showSetupModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowSetupModal(false)}
          >
            <div
              className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 soft-shadow w-full max-w-md animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    pregnant_woman
                  </span>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface">
                    {isSetup ? 'Update Pregnancy Details' : 'Add Your Pregnancy'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowSetupModal(false)}
                  className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Input Method Tabs */}
              <div className="flex gap-2 mb-6 bg-surface-container-low p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setInputMethod('lmp')}
                  className={`flex-1 py-2 px-4 rounded-full text-label-md font-label-md transition-colors ${
                    inputMethod === 'lmp'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  Last Period
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('due')}
                  className={`flex-1 py-2 px-4 rounded-full text-label-md font-label-md transition-colors ${
                    inputMethod === 'due'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  Due Date
                </button>
              </div>

              <form onSubmit={handleSetupSubmit} className="flex flex-col gap-5">
                {inputMethod === 'lmp' ? (
                  <div>
                    <label className="block text-label-md font-label-md text-on-surface-variant mb-2 ml-2">
                      First Day of Your Last Period
                    </label>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.lmpDate}
                      onChange={(e) => setFormData({ ...formData, lmpDate: e.target.value })}
                      className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow"
                    />
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-2 ml-2">
                      This is the most accurate way to calculate your due date.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-label-md font-label-md text-on-surface-variant mb-2 ml-2">
                      Your Due Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow"
                    />
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-2 ml-2">
                      This is usually provided by your doctor.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-secondary text-on-secondary font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  {isSetup ? 'Update' : 'Start Tracking'}
                </button>
              </form>
            </div>
          </div>
        )}

        <FloatingButtons />
      </div>
    </>
  );
}