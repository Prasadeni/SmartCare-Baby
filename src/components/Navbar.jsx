import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="w-full bg-surface/80 backdrop-blur-md shadow-[0_4px_20px_rgba(118,182,227,0.05)] sticky top-0 z-50" data-aos="fade-down">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-2 max-w-6xl mx-auto h-20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
          <h1 className="text-headline-md font-headline font-bold text-primary-dark">SmartCare Baby</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-body-md font-bold text-primary-dark hover:opacity-80 transition-opacity">Home</Link>
          <a className="text-body-md text-on-surface-variant hover:text-primary-dark transition-opacity" href="#">Checkers & Trackers</a>
          <a className="text-body-md text-on-surface-variant hover:text-primary-dark transition-opacity" href="#">Specialists & Guidance</a>
          <a className="text-body-md text-on-surface-variant hover:text-primary-dark transition-opacity" href="#">History</a>
          <a className="text-body-md text-on-surface-variant hover:text-primary-dark transition-opacity" href="#">Info</a>
        </nav>
        <Link to="/login" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;