import { Link } from 'react-router-dom';

const FloatingButtons = () => {
  return (
    <>
      {/* Emergency Button - Moved slightly up to clear space */}
      <Link to="/emergency" className="fixed bottom-24 right-6 flex items-center gap-2 px-5 py-3 rounded-full bg-error text-on-error shadow-[0_8px_30px_rgba(186,26,26,0.35)] hover:scale-105 transition-transform z-[100] font-bold">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
        <span className="text-body-md">Emergency</span>
      </Link>

      {/* Assistant Button - Tooltip moved to the left to avoid overlap */}
      <Link to="/" className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_8px_30px_rgba(118,182,227,0.4)] hover:scale-110 transition-transform z-[100] group" aria-label="SmartCare Baby Assistant">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        
        {/* Tooltip positioned to the left of the button */}
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-4 py-2 bg-on-background text-on-primary text-body-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-[200]">
          Chat with Assistant
        </span>
      </Link>
    </>
  );
};

export default FloatingButtons;