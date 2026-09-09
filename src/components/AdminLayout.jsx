import { Link } from 'react-router-dom';

const styles = `
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .icon-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
`;

const AdminLayout = ({ children, activePage }) => {
  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md antialiased">
        
        {/* Top App Bar */}
        <header className="bg-surface shadow-[0_4px_20px_rgba(118,182,227,0.05)] sticky top-0 z-50">
          <div className="flex justify-between items-center w-full px-4 py-2 max-w-[1440px] mx-auto md:px-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl icon-fill">child_care</span>
              <h1 className="text-headline-md font-headline-md font-bold text-primary tracking-tight">SmartCare Admin</h1>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input className="w-full pl-12 pr-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary-container/30 outline-none transition-all font-body-sm text-body-sm" placeholder="Search users, assessments..." type="text" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors group">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container overflow-hidden border-2 border-surface shadow-sm">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcxzbK6AEotL-TVPDhHKhccY014ldENaXX2P6O9O_dz_rBslp2v8-HgLPd_mDsCP6jWJF-zMq4YYF4Ym04noK46Nft2sXRCxxnxGKeJxYRSmC1vmERFLZNIkTmquSJkcVQF93hOfnM-B9uPo3PTKOqErqldaRPauN5VO5lUbtKdU3_RnoAXNXt3UCTh1CdMrTzpQfGDuDLz3ffbcC-AMAZZ_MY7KQivVYLFohfAZlfPQRpLQaFc-l_" alt="Admin Profile" />
                </div>
                <div className="hidden md:block">
                  <p className="font-headline-sm text-body-sm font-semibold text-on-surface">Dr. Sarah Jenkins</p>
                  <p className="font-label-md text-label-md text-on-surface-variant">System Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
          {/* Sidebar Navigation */}
          <nav className="hidden md:flex flex-col w-64 bg-surface border-r border-outline-variant/20 py-6 px-4 gap-2 h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto">
            
            <p className="px-4 pb-2 text-xs font-bold uppercase text-outline">Overview</p>
            <Link to="/admin" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${activePage === 'dashboard' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined icon-fill">dashboard</span>
              <span className="font-headline-sm text-body-md font-semibold">Dashboard</span>
            </Link>
            
            <p className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-outline">Management</p>
            <Link to="/admin/symptoms" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${activePage === 'symptoms' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">medical_services</span>
              <span className="font-body-md text-body-md">Manage Symptoms</span>
            </Link>
            <Link to="/admin/milestones" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${activePage === 'milestones' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">flag</span>
              <span className="font-body-md text-body-md">Manage Milestones</span>
            </Link>
            <Link to="/admin/risks" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${activePage === 'risks' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">analytics</span>
              <span className="font-body-md text-body-md">Manage Risks</span>
            </Link>
            <Link to="/admin/specialists" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${activePage === 'specialists' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">person_search</span>
              <span className="font-body-md text-body-md">Manage Specialists</span>
            </Link>
            <Link to="/admin/emergency" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${activePage === 'emergency' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">emergency</span>
              <span className="font-body-md text-body-md">Manage Emergency</span>
            </Link>
            <Link to="/admin/education" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${activePage === 'education' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">menu_book</span>
              <span className="font-body-md text-body-md">Manage Education</span>
            </Link>

            <p className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-outline">Platform</p>
            <Link to="/admin/users" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${activePage === 'users' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">group</span>
              <span className="font-body-md text-body-md">Users</span>
            </Link>
            <Link to="/admin/assessments" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${activePage === 'assessments' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">assignment</span>
              <span className="font-body-md text-body-md">Assessments</span>
            </Link>
            
            <Link to="/admin/settings" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group mt-auto ${activePage === 'settings' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">settings</span>
              <span className="font-body-md text-body-md">Settings</span>
            </Link>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-12 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;