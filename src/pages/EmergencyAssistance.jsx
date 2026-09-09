// src/pages/EmergencyAssistance.jsx
import React from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .urgent-shadow { box-shadow: 0 8px 32px rgba(186, 26, 26, 0.15); }
`;

export default function EmergencyAssistance() {
  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md">
        {/* Use the same navbar as dashboard */}
        <DashboardNavbar activePage="dashboard" />

        {/* Main content – same container as dashboard */}
        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12 flex flex-col gap-6">
          
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Emergency Assistance</span>
            </div>
            <h2 className="text-headline-xl font-headline-xl text-on-background">Need Urgent Help?</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
              If your baby is experiencing a life‑threatening emergency, call emergency services immediately.
            </p>
          </div>

          {/* Primary Emergency Action */}
          <div className="bg-error-container rounded-xl p-6 urgent-shadow flex flex-col md:flex-row items-center justify-between gap-4 border border-error/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-headline-xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
              </div>
              <div>
                <h3 className="text-headline-lg font-headline-lg text-on-error-container">Call 911</h3>
                <p className="text-body-md font-body-md text-on-error-container/80">For immediate, life‑threatening medical emergencies.</p>
              </div>
            </div>
            <button className="bg-error text-on-error px-8 py-3 rounded-full font-headline-sm text-headline-sm hover:scale-95 transition-transform duration-200 shadow-md w-full md:w-auto text-center">
              Call Now
            </button>
          </div>

          {/* Secondary Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hospital */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform border border-surface-variant">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-1">
                <span className="material-symbols-outlined">local_hospital</span>
              </div>
              <h4 className="text-headline-md font-headline-md text-on-surface">Nearest Hospital</h4>
              <p className="text-body-sm font-body-sm text-on-surface-variant flex-grow">Connect with the closest ER or urgent care center.</p>
              <button className="mt-4 border-2 border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md w-full hover:bg-primary-container/20 transition-colors">
                Call Hospital
              </button>
            </div>

            {/* Pediatrician */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform border border-surface-variant">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-1">
                <span className="material-symbols-outlined">stethoscope</span>
              </div>
              <h4 className="text-headline-md font-headline-md text-on-surface">Pediatrician</h4>
              <p className="text-body-sm font-body-sm text-on-surface-variant flex-grow">Contact Dr. Sarah Jenkins (On‑Call).</p>
              <button className="mt-4 border-2 border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md w-full hover:bg-primary-container/20 transition-colors">
                Contact Doctor
              </button>
            </div>

            {/* Poison Control */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform border border-surface-variant">
              <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-1">
                <span className="material-symbols-outlined">medical_information</span>
              </div>
              <h4 className="text-headline-md font-headline-md text-on-surface">Poison Control</h4>
              <p className="text-body-sm font-body-sm text-on-surface-variant flex-grow">24/7 expert advice for potential poisonings.</p>
              <button className="mt-4 border-2 border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md w-full hover:bg-primary-container/20 transition-colors">
                Call 1‑800‑222‑1222
              </button>
            </div>
          </div>

          {/* Facilities & Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="text-headline-lg font-headline-lg text-on-background">Nearby 24/7 Pediatric Facilities</h3>
              
              {/* Facility 1 */}
              <div className="bg-surface-container-lowest rounded-lg p-4 soft-shadow flex flex-col sm:flex-row gap-4 border border-surface-variant">
                <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    alt="Clinic Photo"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhXkztudIQGq-0sF_h2h5CnoeFL7Ny4EKBzy0MkaVO39Pbk-aVfICkhywosKffOaZGUvIAWXhotD_5wWsEugBKJRwBus8rqNDCK6dYfb3fdfcqZsdq27wXmdwhfnvlxnMtRRBZlxwQBf1xqsgryUsKkn_2q4KXSgeGyEe2MM1ZpqvTo56X9TsKy0QW50tHrJJSZaZHPVViesYKKncJH3RLiWb_qazopaR8Z31XuecXtmiv3AO0MXtz"
                  />
                </div>
                <div className="flex flex-col flex-grow justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-headline-sm font-headline-sm text-on-surface">City Children's Hospital ER</h4>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Open Now
                      </span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">1.2 miles away • 123 Care Ave, Medical District</p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">directions</span> Directions
                    </button>
                    <button className="border border-outline text-primary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">call</span> Call ER
                    </button>
                  </div>
                </div>
              </div>

              {/* Facility 2 */}
              <div className="bg-surface-container-lowest rounded-lg p-4 soft-shadow flex flex-col sm:flex-row gap-4 border border-surface-variant">
                <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    alt="Clinic Photo"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxoKD_p1Ju3DWccV4bdSOpm8J6SGfo2h0kifsHq5uYQUmc9rr6PZhrGmU-u7FcNn0i0dVVWgo0u3ZmARCQp6EIwLr-Js8ff1yKENtj0zxmWnjfTJa_xzAKU-_VNWQ1CN9v7H47_gR8z4OLQI4jP6pgZrQFV2ZoodjqPFBXbrTqsaooQ3gKSr16eP_9iAL13tTf8pJhEkik9L7edUiZuuxY_x5SxHzucQ-FSdx3ha2MHHz_9pKwKbQj"
                  />
                </div>
                <div className="flex flex-col flex-grow justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-headline-sm font-headline-sm text-on-surface">Northside Pediatric Urgent Care</h4>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Open Now
                      </span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">3.5 miles away • 456 Health Pkwy, Northside</p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">directions</span> Directions
                    </button>
                    <button className="border border-outline text-primary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">call</span> Call Clinic
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Map View */}
            <div className="lg:col-span-1 h-full min-h-[300px]">
              <div className="bg-surface-container-lowest rounded-xl w-full h-full p-2 soft-shadow border border-surface-variant overflow-hidden relative">
                <img
                  alt="Map of nearby facilities"
                  className="w-full h-full object-cover rounded-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcCfpCvWf6JmIhQVZaBPwSJk9Hz-x0YK0DN1pW9q9-dAEGzyCeEK2jQmqAVBusSOqLvbYMqBKWxh5nFBK5MtjNK-NfvSYzLo6lu6E_bn_GYvPpQ4x1kPkvQ0zPIkOHKRrSLAQSrmsoaWVODN4EfeFR_bEmtUR2IhDVN6FbtGf-VUyVcB1kXgDTXl4tzIelbwcaipvROxZ4pPV48yvV_89wiFhPU8RnSgx9B93eBzDwkv_fJW0z850A"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="bg-surface text-on-surface px-3 py-1 rounded-full shadow-md text-label-md font-label-md mb-1 whitespace-nowrap">
                    City Children's
                  </div>
                  <span className="material-symbols-outlined text-error text-3xl drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Global floating buttons (includes Emergency & Assistant) */}
        <FloatingButtons />
      </div>
    </>
  );
}