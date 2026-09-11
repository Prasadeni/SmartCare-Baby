import React from 'react';
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
`;

export default function PregnancyDashboard() {
  // ==========================================
  // BACKEND READY STATE
  // ==========================================
  const pregnancyData = {
    currentWeek: 24,
    trimester: '2nd Trimester',
    daysToGo: 112,
    babySize: 'Cantaloupe',
    babyDescription: 'At 24 weeks, your baby is gaining steady weight and developing distinct sleep/wake cycles.',
    todayKicks: 8,
    weightStatus: 'On Track',
    tipTitle: 'Staying Hydrated & Nourished',
    tipContent: 'As your baby grows rapidly this week, focus on calcium-rich foods and drinking at least 8-10 glasses of water daily to support amniotic fluid levels.'
  };

  // Backend ready: fetch('/api/pregnancy')
  // Then: setPregnancyData(data)

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden pb-32 md:pb-0">
        
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">

          {/* Header Section */}
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-headline-lg-mobile md:text-headline-xl font-headline-xl text-primary mb-2">
              Your Pregnancy Journey
            </h2>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="text-headline-sm font-headline-sm">Week {pregnancyData.currentWeek}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="text-body-lg font-body-lg">{pregnancyData.daysToGo} Days to Go</span>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Left Column: Timeline & Feature Cards (8 cols) */}
            <div className="md:col-span-8 flex flex-col gap-6">

              {/* Journey Progress Card */}
              <section className="bg-surface-container-lowest rounded-xl p-6 soft-shadow border border-surface-variant animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-headline-sm font-headline-sm text-primary mb-6">Journey Progress</h3>

                <div className="relative pt-6 pb-2">
                  {/* Base Track */}
                  <div className="absolute h-3 w-full bg-surface-container-high rounded-full top-1/2 -translate-y-1/2"></div>
                  {/* Filled Track (60% = week 24 of 40) */}
                  <div className="absolute h-3 w-3/5 bg-primary rounded-full top-1/2 -translate-y-1/2"></div>

                  {/* Milestone Nodes */}
                  <div className="relative flex justify-between items-center w-full z-10">

                    {/* 1st Trimester */}
                    <div className="flex flex-col items-center transform -translate-x-1/2 left-0 absolute">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[14px] text-on-primary">check</span>
                      </div>
                      <span className="text-label-md font-label-md text-primary mt-2 whitespace-nowrap">1st Trimester</span>
                    </div>

                    {/* 2nd Trimester */}
                    <div className="flex flex-col items-center transform -translate-x-1/2 left-1/3 absolute">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[14px] text-on-primary">check</span>
                      </div>
                      <span className="text-label-md font-label-md text-primary mt-2 whitespace-nowrap">2nd Trimester</span>
                    </div>

                    {/* Current Position (Week 24) */}
                    <div className="flex flex-col items-center transform -translate-x-1/2 left-2/3 absolute">
                      <div className="w-8 h-8 rounded-full bg-surface-container-lowest border-4 border-primary flex items-center justify-center shadow-md">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                      </div>
                      <span className="text-label-md font-label-md text-primary mt-2 font-bold whitespace-nowrap">Week {pregnancyData.currentWeek}</span>
                    </div>

                    {/* Due Date */}
                    <div className="flex flex-col items-center transform translate-x-1/2 right-0 absolute">
                      <div className="w-6 h-6 rounded-full bg-surface-container-high border-2 border-surface-variant flex items-center justify-center shadow-sm"></div>
                      <span className="text-label-md font-label-md text-on-surface-variant mt-2 whitespace-nowrap">Due Date</span>
                    </div>
                  </div>
                </div>

                {/* Baby Size Info Box */}
                <div className="mt-8 flex items-start gap-4 p-4 bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined text-primary text-3xl">child_friendly</span>
                  <div>
                    <h4 className="text-body-lg font-bold text-on-surface">Baby is the size of a {pregnancyData.babySize}!</h4>
                    <p className="text-body-md text-on-surface-variant mt-1">{pregnancyData.babyDescription}</p>
                  </div>
                </div>
              </section>

              {/* Feature Cards Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Kick Counter Card */}
                <Link to="/kick-counter" className="bg-surface-container-lowest rounded-xl p-6 soft-shadow border border-surface-variant flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-on-primary-fixed text-2xl">footprint</span>
                    </div>
                    <span className="bg-primary-container/20 text-on-primary-container px-3 py-1 rounded-full text-label-md font-label-md">Today: {pregnancyData.todayKicks} Kicks</span>
                  </div>
                  <div>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">Kick Counter</h3>
                    <p className="text-body-sm text-on-surface-variant">Track your baby's daily movements to monitor health.</p>
                  </div>
                </Link>

                {/* Weight Tracker Card */}
                <Link to="/weight-logger" className="bg-surface-container-lowest rounded-xl p-6 soft-shadow border border-surface-variant flex flex-col justify-between hover:bg-secondary-fixed transition-colors cursor-pointer group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-fixed-dim flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-on-secondary-fixed text-2xl">monitor_weight</span>
                    </div>
                    <span className="bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full text-label-md font-label-md">{pregnancyData.weightStatus}</span>
                  </div>
                  <div>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">Weight Tracker</h3>
                    <p className="text-body-sm text-on-surface-variant">Log your weekly weight for healthy maternal progress.</p>
                  </div>
                </Link>

                {/* Contraction Timer Card (Full Width) */}
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

            {/* Right Column: Tip of the Week (4 cols) */}
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

                  <h4 className="text-body-lg font-bold text-on-surface mb-2">{pregnancyData.tipTitle}</h4>
                  <p className="text-body-md text-on-surface-variant mb-4">{pregnancyData.tipContent}</p>

                  <button className="text-secondary font-label-md text-label-md flex items-center gap-1 hover:opacity-80 transition-opacity">
                    Read Full Article
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}