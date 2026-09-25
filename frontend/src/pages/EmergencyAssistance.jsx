// src/pages/EmergencyAssistance.jsx
import React from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

export default function EmergencyAssistance() {
  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="emergency" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12 flex flex-col gap-6">

          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Emergency Assistance</span>
            </div>
            <h2 className="text-headline-xl font-headline-xl text-on-background">Need Urgent Help?</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
              If your baby is experiencing a life-threatening emergency, call emergency services immediately.
            </p>
          </div>

          {/* Primary emergency action */}
          <div className="bg-error-container rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-error/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
              </div>
              <div>
                <h3 className="text-headline-lg font-headline-lg text-on-error-container">Call 1990 (Sri Lanka)</h3>
                <p className="text-body-md text-on-error-container/80">For immediate, life-threatening medical emergencies.</p>
              </div>
            </div>
            <a
              href="tel:1990"
              className="bg-error text-on-error px-8 py-3 rounded-full font-headline-sm text-headline-sm hover:scale-95 transition-transform duration-200 shadow-md w-full md:w-auto text-center"
            >
              Call Now
            </a>
          </div>

          {/* Secondary contacts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform border border-surface-variant">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-1">
                <span className="material-symbols-outlined">local_hospital</span>
              </div>
              <h4 className="text-headline-md font-headline-md text-on-surface">Nearest Hospital</h4>
              <p className="text-body-sm text-on-surface-variant flex-grow">Connect with the closest ER or urgent care center.</p>
              <a
                href="tel:110"
                className="mt-4 border-2 border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md w-full hover:bg-primary-fixed transition-colors text-center"
              >
                Call Hospital
              </a>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform border border-surface-variant">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-1">
                <span className="material-symbols-outlined">stethoscope</span>
              </div>
              <h4 className="text-headline-md font-headline-md text-on-surface">Pediatrician</h4>
              <p className="text-body-sm text-on-surface-variant flex-grow">Contact your child's doctor on-call.</p>
              <a
                href="tel:+94112345678"
                className="mt-4 border-2 border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md w-full hover:bg-primary-fixed transition-colors text-center"
              >
                Contact Doctor
              </a>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform border border-surface-variant">
              <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-1">
                <span className="material-symbols-outlined">medical_information</span>
              </div>
              <h4 className="text-headline-md font-headline-md text-on-surface">Poison Control</h4>
              <p className="text-body-sm text-on-surface-variant flex-grow">24/7 expert advice for potential poisonings.</p>
              <a
                href="tel:+94112686144"
                className="mt-4 border-2 border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md w-full hover:bg-primary-fixed transition-colors text-center"
              >
                Call Poison Control
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-error-container rounded-2xl p-6 flex items-start gap-4 border border-error/20">
            <span className="material-symbols-outlined text-on-error-container text-3xl shrink-0">info</span>
            <div>
              <h4 className="text-headline-sm font-headline-sm text-on-error-container mb-1">
                When to call emergency services
              </h4>
              <ul className="text-body-md text-on-error-container opacity-90 space-y-1 list-disc list-inside">
                <li>Difficulty breathing or stopped breathing</li>
                <li>Unresponsive, unconscious, or severe lethargy</li>
                <li>Seizure or convulsion</li>
                <li>Severe bleeding that won't stop</li>
                <li>Signs of severe dehydration (no urine &gt; 6 hours, sunken eyes)</li>
                <li>Persistent high fever with stiff neck or rash</li>
              </ul>
            </div>
          </div>

          {/* Footer info */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant text-center text-on-surface-variant">
            <p className="text-body-sm font-body-sm">
              Emergency numbers are configurable by administrators. This is a demo view.
            </p>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}