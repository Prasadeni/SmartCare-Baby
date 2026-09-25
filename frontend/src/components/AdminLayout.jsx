// frontend/src/components/AdminLayout.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitial } from '../utils/formatters';

const styles = `
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .icon-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
`;

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', page: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/admin/symptoms', page: 'symptoms', icon: 'medical_services', label: 'Manage Symptoms' },
      { to: '/admin/milestones', page: 'milestones', icon: 'flag', label: 'Manage Milestones' },
      { to: '/admin/risks', page: 'risks', icon: 'analytics', label: 'Manage Risks' },
      { to: '/admin/specialists', page: 'specialists', icon: 'person_search', label: 'Manage Specialists' },
      { to: '/admin/emergency', page: 'emergency', icon: 'emergency', label: 'Manage Emergency' },
      { to: '/admin/education', page: 'education', icon: 'menu_book', label: 'Manage Education' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { to: '/admin/users', page: 'users', icon: 'group', label: 'Users' },
      { to: '/admin/assessments', page: 'assessments', icon: 'assignment', label: 'Assessments' },
      { to: '/admin/settings', page: 'settings', icon: 'settings', label: 'Settings' },
    ],
  },
];

const AdminLayout = ({ children, activePage }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.fullName || 'Admin';
  const displayInitial = getInitial(displayName);

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md antialiased">

        {/* ── Top App Bar ─────────────────────────────────── */}
        <header className="bg-surface shadow-[0_4px_20px_rgba(118,182,227,0.05)] sticky top-0 z-50">
          <div className="flex justify-between items-center w-full px-4 py-2 max-w-[1440px] mx-auto md:px-6">
            {/* Left: logo */}
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl icon-fill">
                child_care
              </span>
              <h1 className="text-headline-md font-headline-md font-bold text-primary tracking-tight">
                SmartCare Admin
              </h1>
            </div>

            {/* Right: notification + avatar dropdown */}
            <div className="flex items-center gap-4">
            

              {/* Avatar dropdown */}
              <div className="relative pl-4 border-l border-outline-variant/30" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-headline-sm border-2 border-surface shadow-sm">
                    {displayInitial}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-headline-sm text-body-sm font-semibold text-on-surface">
                      {displayName}
                    </p>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      {user?.role === 'Admin' ? 'System Administrator' : user?.role || 'User'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant hidden md:inline">
                    {menuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl soft-shadow border border-outline-variant/20 py-2 z-[100]">
                    <div className="px-4 py-2 border-b border-outline-variant/20">
                      <p className="font-body-sm font-semibold text-on-surface truncate">
                        {displayName}
                      </p>
                      <p className="font-body-sm text-on-surface-variant truncate">
                        {user?.email || ''}
                      </p>
                    </div>

                    <Link
                      to="/admin/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">settings</span>
                      <span className="font-body-md">Settings</span>
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      <span className="font-body-md">View public site</span>
                    </Link>

                    <hr className="my-1 border-outline-variant/20" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-error hover:bg-error-container/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      <span className="font-body-md font-semibold">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Body: sidebar + main ───────────────────────── */}
        <div className="flex-1 flex max-w-[1440px] w-full mx-auto">

          {/* Sidebar */}
          <nav className="hidden md:flex flex-col w-64 bg-surface border-r border-outline-variant/20 py-6 px-4 gap-1 h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label} className="mb-2">
                <p className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-outline tracking-wider">
                  {section.label}
                </p>

                {section.items.map((item) => {
                  const active = activePage === item.page;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors group ${
                        active
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${active ? 'icon-fill' : ''}`}
                      >
                        {item.icon}
                      </span>
                      <span className={`text-body-md ${active ? 'font-semibold' : ''}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 lg:p-12 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;