import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
`;

export default function UserDashboard() {
  // ==========================================
  // BACKEND READY STATE (Change these later via API)
  // ==========================================
  const [userData, setUserData] = useState({
    parentName: 'Sarah',
    babyName: 'Leo',
    babyAge: '6 months old',
    birthDate: 'Oct 12, 2023',
    weight: '18.5 lbs',
    height: '28 in',
    sleepAvg: '11 hrs',
    feedsPerDay: '5/day',
    milestones: 80,
    growthPercentile: 75
  });

  // State to trigger the bar animations after load
  const [animateBars, setAnimateBars] = useState(false);

  // ==========================================
  // BACKEND CONNECTION PLACEHOLDER
  // ==========================================
  useEffect(() => {
    // UNCOMMENT AND USE THIS WHEN YOUR BACKEND IS READY:
    /*
    const token = localStorage.getItem('token');
    fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error(err));
    */

    // FOR NOW: Trigger the bar animations after 500ms
    const timer = setTimeout(() => {
      setAnimateBars(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen overflow-x-hidden font-body-md text-body-md bg-background">
        
        {/* New Dashboard Navbar */}
        <DashboardNavbar />

        {/* Main Content Canvas */}
        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12 flex flex-col gap-6 pb-32">
          
          {/* Greeting Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
            <div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface flex items-center gap-2">
                {getGreeting()}, {userData.parentName}
                <span className="material-symbols-outlined text-secondary-container text-[32px] md:text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </h2>
              <p className="text-body-lg font-body-lg text-on-surface-variant mt-2">Here's {userData.babyName}'s latest update.</p>
            </div>
            <div className="hidden md:flex gap-2">
              {/* PREGNANCY JOURNEY BUTTON (NEW) */}
              <Link to="/pregnancy" className="bg-secondary-container text-on-secondary-container font-label-md text-label-md py-3 px-6 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">pregnant_woman</span>
                Pregnancy Journey
              </Link>
              {/* LOG ACTIVITY BUTTON */}
              <Link to="/add-baby" className="bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-full hover:bg-surface-tint transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Log Activity
              </Link>
            </div>
          </section>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Profile & Tracking (8 cols) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              
              {/* Baby Profile Bento Card */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-surface-container-high rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 border-4 border-surface-container-low relative">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkb0o_4iwlcsrN2uMIMq80xKlE54Mqj10jR1O54DAeWC3CdlY8L6n0fmyEXKaFhY8DX2OsJXqFZm6vzryOx-O0WIqraeIieX5Rw3g2AOwPY5oHvAVH_X8eoI5GpSnfvHOEircYLrUHL_SFekH59R47RHsmolhZ-tk31C4urkquH4Z3Pm7erqLqpMb6HIhUPvV9F0emHyMDthF9QWavmWEXZUmhW3ibMFHrFdYoLQCXVhNTyHHZ4RB_" alt={`Baby ${userData.babyName}`} />
                </div>
                <div className="flex flex-col items-center md:items-start justify-center flex-1 h-full pt-2 md:pt-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-headline-md font-headline-md text-on-surface font-bold">{userData.babyName}</h3>
                    <span className="bg-[#e6f4ea] text-[#137333] px-3 py-1 rounded-full text-label-md font-label-md flex items-center gap-1 border border-[#ceead6]">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Healthy
                    </span>
                  </div>
                  <p className="text-body-md font-body-md text-on-surface-variant mb-4">{userData.babyAge} • Born {userData.birthDate}</p>
                  <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-surface-container p-3 rounded-xl flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">monitor_weight</span>
                      <span className="text-label-md font-label-md text-on-surface-variant">Weight</span>
                      <span className="text-body-md font-body-md text-on-surface font-semibold">{userData.weight}</span>
                    </div>
                    <div className="bg-surface-container p-3 rounded-xl flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">height</span>
                      <span className="text-label-md font-label-md text-on-surface-variant">Height</span>
                      <span className="text-body-md font-body-md text-on-surface font-semibold">{userData.height}</span>
                    </div>
                    <div className="bg-surface-container p-3 rounded-xl flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-secondary mb-1 text-[20px]">bedtime</span>
                      <span className="text-label-md font-label-md text-on-surface-variant">Sleep Avg</span>
                      <span className="text-body-md font-body-md text-on-surface font-semibold">{userData.sleepAvg}</span>
                    </div>
                    <div className="bg-surface-container p-3 rounded-xl flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">restaurant</span>
                      <span className="text-label-md font-label-md text-on-surface-variant">Feeds</span>
                      <span className="text-body-md font-body-md text-on-surface font-semibold">{userData.feedsPerDay}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Tracking Progress */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow flex flex-col gap-6">
                <h3 className="text-headline-sm font-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">monitoring</span>
                  Health Tracking
                </h3>
                <div className="flex flex-col gap-4">
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-body-md font-body-md text-on-surface-variant font-semibold">6 Month Milestones</span>
                      <span className="text-label-md font-label-md text-primary">{userData.milestones}%</span>
                    </div>
                    <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-primary rounded-full transition-all ease-out duration-[2000ms]`}
                        style={{ width: animateBars ? `${userData.milestones}%` : '0%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-body-md font-body-md text-on-surface-variant font-semibold">Growth Percentile</span>
                      <span className="text-label-md font-label-md text-secondary">{userData.growthPercentile}th</span>
                    </div>
                    <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-secondary rounded-full transition-all ease-out duration-[2000ms]`}
                        style={{ width: animateBars ? `${userData.growthPercentile}%` : '0%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Vaccination Alert - LINKS TO /vaccinations */}
                  <div className="mt-4 bg-surface-container-low border border-surface-dim rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">vaccines</span>
                      </div>
                      <div>
                        <p className="text-body-md font-body-md text-on-surface font-semibold">Next Vaccination</p>
                        <p className="text-body-sm font-body-sm text-on-surface-variant">Dose due in 2 weeks (Oct 26)</p>
                      </div>
                    </div>
                    <Link to="/vaccinations" className="bg-transparent border-2 border-primary text-primary px-4 py-2 rounded-full font-label-md text-label-md hover:bg-primary-fixed/30 transition-colors">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions & Logs (4 cols) */}
            <div className="md:col-span-4 flex flex-col gap-6">
              
              {/* Quick Actions */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow">
                <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/symptoms" className="bg-surface-container hover:bg-surface-container-high transition-colors p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-primary text-[28px]">stethoscope</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Check Symptoms</span>
                  </Link>

                  <Link to="/milestones" className="bg-surface-container hover:bg-surface-container-high transition-colors p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-primary text-[28px]">flag</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Milestone Check</span>
                  </Link>

                  <Link to="/mchat" className="bg-surface-container hover:bg-surface-container-high transition-colors p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-primary text-[28px]">psychology_alt</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Autism Screener</span>
                  </Link>

                  <Link to="/growth" className="bg-surface-container hover:bg-surface-container-high transition-colors p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-primary text-[28px]">straighten</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Track Growth</span>
                  </Link>

                  <Link to="/specialists" className="bg-surface-container hover:bg-surface-container-high transition-colors p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-primary text-[28px]">medical_information</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Find Specialist</span>
                  </Link>

                  <Link to="/chatbot" className="bg-surface-container hover:bg-surface-container-high transition-colors p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-primary text-[28px]">psychiatry</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Ask AI</span>
                  </Link>
                </div>
              </div>

              {/* Recent Logs */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface">Recent Logs</h3>
                  <button className="text-primary text-label-md font-label-md hover:underline">View All</button>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 relative before:absolute before:left-[19px] before:top-10 before:bottom-[-16px] before:w-[2px] before:bg-surface-container">
                    <div className="w-10 h-10 rounded-full bg-inverse-on-surface flex items-center justify-center shrink-0 z-10">
                      <span className="material-symbols-outlined text-primary text-[20px]">water_bottle</span>
                    </div>
                    <div className="flex-1 bg-surface-bright rounded-xl p-3 border border-surface-container-low">
                      <div className="flex justify-between items-start">
                        <p className="text-body-md font-body-md text-on-surface font-semibold">Formula Bottle</p>
                        <span className="text-label-md font-label-md text-on-surface-variant">2h ago</span>
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">6 oz consumed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 relative">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 z-10">
                      <span className="material-symbols-outlined text-secondary text-[20px]">crib</span>
                    </div>
                    <div className="flex-1 bg-surface-bright rounded-xl p-3 border border-surface-container-low">
                      <div className="flex justify-between items-start">
                        <p className="text-body-md font-body-md text-on-surface font-semibold">Nap Time</p>
                        <span className="text-label-md font-label-md text-on-surface-variant">4h ago</span>
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Duration: 1h 30m</p>
                    </div>
                  </div>
                </div>
                {/* Mobile: Pregnancy + Log Buttons */}
                <div className="md:hidden flex flex-col gap-3 mt-6">
                  <Link to="/pregnancy" className="w-full bg-secondary-container text-on-secondary-container font-label-md text-label-md py-3 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">pregnant_woman</span>
                    Pregnancy Journey
                  </Link>
                  <Link to="/add-baby" className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-full hover:bg-surface-tint transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Log New Activity
                  </Link>
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