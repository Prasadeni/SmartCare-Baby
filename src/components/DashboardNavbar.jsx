import { Link } from 'react-router-dom';

const DashboardNavbar = ({ activePage }) => {
  return (
    <>
      {/* Desktop Top Nav */}
      <header className="hidden md:flex bg-surface shadow-[0_4px_20px_rgba(118,182,227,0.05)] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-4 py-2 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0 border-2 border-primary/20 hover:border-primary transition-colors">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC782WAtcfKDXg2FSETC60JX7fcdBlWZik9MItKvm3U5RYFwKWC72Sctksjb3Pr2tvMdytMe72JGG9fUoGw9RAGa54NIZf1YzsGWTwPvQ-o1DFwMxEHDbH7IlRooRpJ9GDKIa4ISgI9um3UwAVEXPMuH_am5gBEUPHeKi74vaF3tlg7ZRl0kmMYKhOjiUuOdVJqeRPmXhR6KD8YDPcTEwbF4Gmfl8jazohuiRJJo5wBU7smIK-nuk3j" alt="Profile" />
            </Link>
            <h1 className="text-headline-md font-headline-md font-bold text-primary">SmartCare Baby</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/dashboard" className={`flex flex-col items-center justify-center hover:opacity-80 transition-opacity ${activePage === 'dashboard' ? 'text-primary' : 'text-on-surface-variant'}`}>
              <span className="material-symbols-outlined mb-1 text-[24px]">dashboard</span>
              <span className="text-label-md font-label-md">Dashboard</span>
            </Link>
            
            {/* Babies */}
            <Link to="/milestones" className={`flex flex-col items-center justify-center hover:opacity-80 transition-opacity ${activePage === 'babies' ? 'text-primary' : 'text-on-surface-variant'}`}>
              <span className="material-symbols-outlined mb-1 text-[24px]">child_care</span>
              <span className="text-label-md font-label-md">Babies</span>
              {activePage === 'babies' && (
                <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
              )}
            </Link>
            
            {/* Education and Assistant are dead links until built */}
            <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined mb-1 text-[24px]">menu_book</span>
              <span className="text-label-md font-label-md">Education</span>
            </a>
            <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined mb-1 text-[24px]">smart_toy</span>
              <span className="text-label-md font-label-md">Assistant</span>
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button className="bg-error-container text-on-error-container px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 hover:bg-error hover:text-on-error transition-colors">
              <span className="material-symbols-outlined text-[18px]">emergency</span> Emergency
            </button>
            <button aria-label="Notifications" className="text-primary hover:opacity-80 transition-opacity flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-4 pt-2 bg-surface shadow-[0_-4px_20px_rgba(118,182,227,0.05)] rounded-t-lg">
        <Link to="/dashboard" className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 scale-95 transition-transform duration-200">
          <span className="material-symbols-outlined mb-1">dashboard</span>
          <span className="text-label-md font-label-md text-center">Dashboard</span>
        </Link>
        <Link to="/milestones" className="flex flex-col items-center justify-center text-primary px-4 py-1 hover:bg-surface-container-high rounded-full">
          <span className="material-symbols-outlined mb-1">child_care</span>
          <span className="text-label-md font-label-md text-center">Babies</span>
        </Link>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-container-high rounded-full">
          <span className="material-symbols-outlined mb-1">menu_book</span>
          <span className="text-label-md font-label-md text-center">Education</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-container-high rounded-full">
          <span className="material-symbols-outlined mb-1">smart_toy</span>
          <span className="text-label-md font-label-md text-center">Assistant</span>
        </a>
      </nav>
    </>
  );
};

export default DashboardNavbar;