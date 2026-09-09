import React from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
`;

export default function AdminDashboard() {
  // FIXED: Hardcoded bar data with bold colors and heights
  const barData = [
    { day: 'Mon', height: 'h-[40%]', val: '4,200', color: 'bg-primary group-hover:bg-primary-container' },
    { day: 'Tue', height: 'h-[55%]', val: '5,800', color: 'bg-primary group-hover:bg-primary-container' },
    { day: 'Wed', height: 'h-[70%]', val: '7,100', color: 'bg-primary group-hover:bg-primary-container' },
    { day: 'Thu', height: 'h-[90%]', val: '9,450', color: 'bg-secondary', isHighlighted: true }, // Pink standout
    { day: 'Fri', height: 'h-[65%]', val: '6,500', color: 'bg-primary group-hover:bg-primary-container' },
    { day: 'Sat', height: 'h-[30%]', val: '3,100', color: 'bg-tertiary group-hover:bg-tertiary-container' },
    { day: 'Sun', height: 'h-[25%]', val: '2,800', color: 'bg-tertiary group-hover:bg-tertiary-container' },
  ];

  return (
    <>
      <style>{styles}</style>
      <AdminLayout activePage="dashboard">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in-up">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">System Overview</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Monitor platform health, user activity, and critical alerts.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary text-primary font-headline-sm text-body-md hover:bg-primary-container/10 transition-colors">
              <span className="material-symbols-outlined text-[20px]">download</span> Export Report
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-headline-sm text-body-md hover:opacity-90 transition-opacity shadow-sm hover:shadow-md">
              <span className="material-symbols-outlined text-[20px]">add</span> New Admin
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/10 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-container/20 rounded-full blur-xl group-hover:bg-primary-container/30 transition-all"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-surface-container-high rounded-2xl">
                <span className="material-symbols-outlined text-primary">group</span>
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-[#14b8a6] bg-[#ccfbf1] px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[16px]">trending_up</span> +12%
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-body-sm font-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">Total Users</h3>
              <p className="text-headline-xl font-headline-xl text-on-surface">24,592</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-error-container relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-error-container/40 rounded-full blur-xl group-hover:bg-error-container/60 transition-all"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-error-container rounded-2xl text-on-error-container">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-error bg-error-container px-2.5 py-1 rounded-full uppercase tracking-wider">Action Req</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-body-sm font-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">High-Risk Alerts</h3>
              <p className="text-headline-xl font-headline-xl text-error">18</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/10 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary-container/30 rounded-full blur-xl group-hover:bg-secondary-container/50 transition-all"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-secondary-container rounded-2xl text-on-secondary-container">
                <span className="material-symbols-outlined">assignment_turned_in</span>
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-secondary bg-secondary-fixed px-2.5 py-1 rounded-full">92%</span>
            </div>
            <div className="relative z-10 flex flex-col justify-between h-[calc(100%-48px)]">
              <div>
                <h3 className="text-body-sm font-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">Assessments</h3>
                <p className="text-headline-xl font-headline-xl text-on-surface mb-2">8,204</p>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-secondary h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Area - FULLY FIXED */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 soft-shadow border border-outline-variant/10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-sm font-headline-sm text-on-surface">System Usage Trends</h3>
              <select className="bg-surface-container-high border-none rounded-full px-4 py-1.5 text-body-sm font-body-sm text-on-surface focus:ring-2 focus:ring-primary outline-none">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            
            <div className="h-[300px] w-full flex items-end justify-between gap-2 md:gap-4 pt-4 relative">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-outline-variant pb-8 hidden sm:flex">
                <span>10k</span><span>7.5k</span><span>5k</span><span>2.5k</span><span>0</span>
              </div>
              
              {/* Grid Lines */}
              <div className="absolute left-0 sm:left-8 right-0 top-0 h-full flex flex-col justify-between pb-8 z-0">
                <div className="w-full border-t border-outline-variant/20"></div>
                <div className="w-full border-t border-outline-variant/20"></div>
                <div className="w-full border-t border-outline-variant/20"></div>
                <div className="w-full border-t border-outline-variant/20"></div>
                <div className="w-full border-t border-outline-variant/50"></div>
              </div>
              
              {/* THE BARS - Now using hardcoded heights and bold colors */}
              {barData.map((bar, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 z-10 h-full justify-end group">
                  <div className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 relative group-hover:scale-105 ${bar.height} ${bar.color}`}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">
                      {bar.val}
                    </div>
                  </div>
                  <span className={`text-xs font-label-md ${bar.isHighlighted ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/10 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-sm font-headline-sm text-on-surface">Recent Alerts</h3>
              <button className="text-primary text-body-sm font-headline-sm hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: '350px' }}>
              <div className="p-4 rounded-2xl bg-surface-bright border border-error-container hover:bg-error-container/10 transition-colors cursor-pointer group flex items-start gap-3">
                <div className="mt-1 p-2 bg-error-container text-error rounded-full shrink-0"><span className="material-symbols-outlined text-[18px]">favorite</span></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-body-sm font-headline-sm text-on-surface truncate pr-2">Abnormal HR Detected</h4>
                    <span className="text-[10px] text-outline whitespace-nowrap pt-0.5">2m ago</span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant line-clamp-1 mb-2">Patient ID: #8492 - Sustained elevated heart rate &gt; 160bpm.</p>
                  <span className="inline-block bg-error-container text-error text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Critical</span>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-surface-bright border border-secondary-container/50 hover:bg-secondary-container/10 transition-colors cursor-pointer group flex items-start gap-3">
                <div className="mt-1 p-2 bg-secondary-container text-on-secondary-container rounded-full shrink-0"><span className="material-symbols-outlined text-[18px]">assignment_late</span></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-body-sm font-headline-sm text-on-surface truncate pr-2">Missed Assessment</h4>
                    <span className="text-[10px] text-outline whitespace-nowrap pt-0.5">1h ago</span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant line-clamp-1 mb-2">User #3102 missed daily maternal well-being check.</p>
                  <span className="inline-block bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Warning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
      <FloatingButtons />
    </>
  );
}