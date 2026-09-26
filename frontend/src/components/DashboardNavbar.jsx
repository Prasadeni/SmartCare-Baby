// src/components/DashboardNavbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getInitial } from '../utils/formatters';

const DashboardNavbar = ({ activePage }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'si' ? 'en' : 'si');
  };

  const isMother = user?.role === 'PregnantMother';
  const isActive = (page) => activePage === page;

  const navItems = isMother
    ? [
        { to: '/dashboard', page: 'dashboard', icon: 'dashboard', label: t('nav.dashboard') },
        { to: '/pregnancy', page: 'pregnancy', icon: 'pregnant_woman', label: t('nav.pregnancy') },
        { to: '/babies', page: 'babies', icon: 'child_care', label: t('nav.babies') },
        { to: '/reports', page: 'reports', icon: 'summarize', label: t('nav.reports') },
        { to: '/education', page: 'education', icon: 'menu_book', label: t('nav.education') },
        { to: '/assistant', page: 'assistant', icon: 'smart_toy', label: t('nav.assistant') },
      ]
    : [
        { to: '/dashboard', page: 'dashboard', icon: 'dashboard', label: t('nav.dashboard') },
        { to: '/babies', page: 'babies', icon: 'child_care', label: t('nav.babies') },
        { to: '/reports', page: 'reports', icon: 'summarize', label: t('nav.reports') },
        { to: '/education', page: 'education', icon: 'menu_book', label: t('nav.education') },
        { to: '/assistant', page: 'assistant', icon: 'smart_toy', label: t('nav.assistant') },
      ];

  const renderAvatar = (size = 'w-11 h-11', border = 'border-2') => {
    if (user?.avatarUrl) {
      return (
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className={`${size} rounded-full object-cover ${border} border-primary/20`}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      );
    }
    return (
      <div
        className={`${size} rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md font-bold ${border} border-primary/20`}
      >
        {getInitial(user?.fullName)}
      </div>
    );
  };

  return (
    <>
      <header className="hidden md:flex bg-surface shadow-[0_4px_20px_rgba(118,182,227,0.05)] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-4 py-2 max-w-[1200px] mx-auto">

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="shrink-0 hover:scale-105 transition-transform duration-200"
              title="My Profile"
            >
              {renderAvatar('w-11 h-11')}
            </Link>
            <div>
              <h1 className="text-headline-md font-headline-md font-bold text-primary leading-tight">
                SmartCare Baby
              </h1>
              <p className="text-label-md font-label-md text-on-surface-variant leading-tight">
                {user?.fullName?.split(' ')[0] || 'Welcome'}
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.page);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-full transition-all duration-200 ${
                    active
                      ? 'text-primary bg-primary/5'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span
                    className="material-symbols-outlined mb-1 text-[22px]"
                    style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-label-md">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              aria-label="Switch language"
              title="Switch language"
              className="text-on-surface-variant hover:text-primary transition-all duration-200 flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-container-low font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-[18px]">language</span>
              {i18n.language === 'si' ? 'EN' : 'සිං'}
            </button>

            <Link
              to="/emergency"
              className="bg-error-container text-on-error-container px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 hover:bg-error hover:text-on-error transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              {t('nav.emergency')}
            </Link>

            <button
              onClick={handleLogout}
              aria-label={t('nav.logout')}
              title={t('nav.logout')}
              className="text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 pb-4 pt-2 bg-surface shadow-[0_-4px_20px_rgba(118,182,227,0.05)] rounded-t-lg">
        {navItems.slice(0, 5).map((item) => {
          const active = isActive(item.page);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-full transition-all duration-200 ${
                active
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span
                className="material-symbols-outlined mb-1"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-label-md text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default DashboardNavbar;