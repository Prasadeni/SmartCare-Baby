// src/pages/ComingSoon.jsx
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

export default function ComingSoon({ title = 'This page' }) {
  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md">
        <DashboardNavbar />
        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
          <div className="max-w-2xl mx-auto bg-surface-container-lowest rounded-[2rem] p-12 soft-shadow text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-fixed flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                construction
              </span>
            </div>
            <h2 className="text-headline-lg font-headline-lg text-primary mb-3">
              {title}
            </h2>
            <p className="text-body-md text-on-surface-variant">
              This page is coming soon. It will be built in a future batch.
            </p>
          </div>
        </main>
        <FloatingButtons />
      </div>
    </>
  );
}