import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Added for carousel
import heroImage from '../assets/hero.jpg';
import hero1 from '../assets/hero1.jpg';
import hero2 from '../assets/hero2.jpg';
import hero3 from '../assets/hero3.jpg';

function Home() {
  // Carousel Logic
  const slides = [heroImage, hero1, hero2, hero3];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000); // Changes every 4 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body overflow-x-hidden">
      
      {/* ===== HEADER ===== */}
      <header className="w-full bg-surface/80 backdrop-blur-md shadow-[0_4px_20px_rgba(118,182,227,0.05)] sticky top-0 z-50" data-aos="fade-down">
        <div className="flex justify-between items-center w-full px-4 md:px-6 py-2 max-w-6xl mx-auto h-20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
            <h1 className="text-headline-md font-headline font-bold text-primary-dark">SmartCare Baby</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-body-md font-bold text-primary-dark hover:opacity-80 transition-opacity" href="#">Home</a>
            <a className="text-body-md text-on-surface-variant hover:text-primary-dark transition-opacity" href="#">Checkers & Trackers</a>
            <a className="text-body-md text-on-surface-variant hover:text-primary-dark transition-opacity" href="#">Specialists & Guidance</a>
            <a className="text-body-md text-on-surface-variant hover:text-primary-dark transition-opacity" href="#">History</a>
            <a className="text-body-md text-on-surface-variant hover:text-primary-dark transition-opacity" href="#">Info</a>
          </nav>
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </button>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col">
        
        {/* ===== SCREEN 1: HERO SECTION ===== */}
        <section className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row items-center justify-center gap-12">
          
          <div className="flex-1 flex flex-col gap-6 order-2 md:order-1" data-aos="fade-right">
            <div className="inline-flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full w-max text-primary-dark">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className="text-label-md font-label-md text-primary-dark">Nurturing Growth, Step by Step</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-headline font-extrabold text-on-background leading-tight">
              Smarter Care for Every <br />
              <span className="text-secondary">Little Milestone</span>
            </h2>
            
            <p className="text-base md:text-lg font-body text-on-surface-variant max-w-lg leading-relaxed">
              Your intuitive companion for monitoring your baby's development and tracking your pregnancy journey. Built with warmth, backed by expert guidance to reduce parental anxiety.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                to="/register" 
                className="bg-primary text-on-primary px-8 py-3.5 rounded-full text-body-md font-bold hover:scale-105 transition-transform shadow-[0_8px_30px_rgba(118,182,227,0.35)]"
              >
                Start Your Journey
              </Link>
              <button className="border-2 border-primary bg-transparent text-primary px-8 py-3.5 rounded-full text-body-md font-bold hover:bg-primary/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Crossfading Carousel Container */}
          <div className="flex-1 w-full order-1 md:order-2 relative h-[500px]" data-aos="fade-left">
            {/* Soft background blur for depth */}
            <div className="absolute inset-0 bg-secondary/20 rounded-full filter blur-[120px] opacity-40 -z-10 transform scale-110"></div>

            {/* 4 Images: All perfectly aligned, same size, crossfading */}
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt="SmartCare Baby features"
                className={`absolute inset-0 w-full h-full object-cover rounded-2xl shadow-[0_20px_60px_rgba(118,182,227,0.2)] transition-all duration-[1500ms] ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              />
            ))}
          </div>
        </section>

        {/* ===== SCREEN 2: SERVICES SECTION (3x2 Grid, No Space Above) ===== */}
        <section className="min-h-screen flex flex-col gap-8 items-center pt-12 md:pt-16" data-aos="fade-up">
          
          <div className="text-center max-w-3xl flex flex-col gap-2">
            <h3 className="text-4xl md:text-5xl font-headline font-bold text-primary-dark">Our Services</h3>
            <p className="text-lg md:text-xl font-body text-on-surface-variant">
              Empowering your parenting journey with precision tools and expert care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            
            {/* Card 1 */}
            <div className="bg-on-primary rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)] flex flex-col gap-4 hover:shadow-[0_12px_40px_rgba(118,182,227,0.12)] hover:-translate-y-1 transition-all duration-300 group h-full" data-aos="fade-up" data-aos-delay="50">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors flex-shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
              </div>
              <h4 className="text-headline-sm font-headline font-bold text-on-background">Baby Symptoms Tracker</h4>
              <p className="text-body-md font-body text-on-surface-variant flex-1 leading-relaxed">
                Answer questions about your baby's symptoms, receive results, and access relevant specialist guidance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-on-primary rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)] flex flex-col gap-4 hover:shadow-[0_12px_40px_rgba(118,182,227,0.12)] hover:-translate-y-1 transition-all duration-300 group h-full" data-aos="fade-up" data-aos-delay="100">
              <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-primary transition-colors flex-shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <h4 className="text-headline-sm font-headline font-bold text-on-background">Milestone Tracker</h4>
              <p className="text-body-md font-body text-on-surface-variant flex-1 leading-relaxed">
                Monitor your baby's developmental progress using M-CHAT-R screening and milestone tracking.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-on-primary rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)] flex flex-col gap-4 hover:shadow-[0_12px_40px_rgba(118,182,227,0.12)] hover:-translate-y-1 transition-all duration-300 group h-full" data-aos="fade-up" data-aos-delay="150">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors flex-shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pregnant_woman</span>
              </div>
              <h4 className="text-headline-sm font-headline font-bold text-on-background">Pregnancy Tracker</h4>
              <p className="text-body-md font-body text-on-surface-variant flex-1 leading-relaxed">
                Track your pregnancy with Kick Counter, Contraction Timer, and Weight Tracker tools.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-on-primary rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)] flex flex-col gap-4 hover:shadow-[0_12px_40px_rgba(118,182,227,0.12)] hover:-translate-y-1 transition-all duration-300 group h-full" data-aos="fade-up" data-aos-delay="200">
              <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-primary transition-colors flex-shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              </div>
              <h4 className="text-headline-sm font-headline font-bold text-on-background">Baby Growth Tracker</h4>
              <p className="text-body-md font-body text-on-surface-variant flex-1 leading-relaxed">
                Monitor your baby's weight, height, and head circumference over time with visual charts.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-on-primary rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)] flex flex-col gap-4 hover:shadow-[0_12px_40px_rgba(118,182,227,0.12)] hover:-translate-y-1 transition-all duration-300 group h-full" data-aos="fade-up" data-aos-delay="250">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors flex-shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
              </div>
              <h4 className="text-headline-sm font-headline font-bold text-on-background">Specialist Guidance</h4>
              <p className="text-body-md font-body text-on-surface-variant flex-1 leading-relaxed">
                Find suitable specialists with search, Nearby toggle, and detailed doctor profiles.
              </p>
            </div>

            {/* Card 6 - NEW */}
            <div className="bg-on-primary rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)] flex flex-col gap-4 hover:shadow-[0_12px_40px_rgba(118,182,227,0.12)] hover:-translate-y-1 transition-all duration-300 group h-full" data-aos="fade-up" data-aos-delay="300">
              <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-primary transition-colors flex-shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>vaccines</span>
              </div>
              <h4 className="text-headline-sm font-headline font-bold text-on-background">Vaccination Reminder</h4>
              <p className="text-body-md font-body text-on-surface-variant flex-1 leading-relaxed">
                Never miss a vaccine dose with automated reminders based on your baby's age and schedule.
              </p>
            </div>

          </div>
        </section>

        {/* ===== SCREEN 3: TRUST / DISCLAIMER SECTION (Full Screen) ===== */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center gap-6 max-w-4xl mx-auto py-12" data-aos="fade-up">
          <span className="material-symbols-outlined text-secondary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <h3 className="text-4xl md:text-5xl font-headline font-bold text-secondary">Your Trust, Our Priority</h3>
          <p className="text-lg font-body text-on-surface-variant max-w-2xl leading-relaxed">
            SmartCare Baby is designed to support and empower your parenting journey. We utilize industry-standard security to protect your family's data.
          </p>
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant max-w-3xl mt-4">
            <p className="text-body-sm font-body text-tertiary leading-relaxed">
              <strong>Medical Disclaimer:</strong> SmartCare Baby provides informational resources and tracking tools, not medical advice. The AI Assistant and screening tools do not diagnose medical conditions. Always consult with a qualified healthcare provider.
            </p>
          </div>
        </section>
      </main>

      {/* ===== FOOTER (No Heart Emoji) ===== */}
      <footer className="w-full bg-surface border-t border-surface-container pt-12 pb-4" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
                <span className="text-headline-sm font-headline font-bold text-primary-dark">SmartCare Baby</span>
              </div>
              <p className="text-body-sm font-body text-on-surface-variant leading-relaxed">
                Empowering parents with gentle, intuitive tools for early childhood care and maternal health.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-label-md font-label-md text-tertiary uppercase tracking-wider">Platform</h4>
              <a className="text-body-sm font-body text-on-surface-variant hover:text-primary-dark transition-colors" href="#">Features</a>
              <a className="text-body-sm font-body text-on-surface-variant hover:text-primary-dark transition-colors" href="#">Pricing</a>
              <a className="text-body-sm font-body text-on-surface-variant hover:text-primary-dark transition-colors" href="#">How It Works</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-label-md font-label-md text-tertiary uppercase tracking-wider">Resources</h4>
              <a className="text-body-sm font-body text-on-surface-variant hover:text-primary-dark transition-colors" href="#">Blog & Education</a>
              <a className="text-body-sm font-body text-on-surface-variant hover:text-primary-dark transition-colors" href="#">Expert Network</a>
              <a className="text-body-sm font-body text-on-surface-variant hover:text-primary-dark transition-colors" href="#">Help Center</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-label-md font-label-md text-tertiary uppercase tracking-wider">Legal</h4>
              <a className="text-body-sm font-body text-on-surface-variant hover:text-primary-dark transition-colors" href="#">Privacy Policy</a>
              <a className="text-body-sm font-body text-on-surface-variant hover:text-primary-dark transition-colors" href="#">Terms of Service</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-surface-container pt-6">
            <p className="text-body-sm font-body text-tertiary">© 2024 SmartCare Baby. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span className="text-body-sm font-body text-tertiary">Made with care for parents everywhere.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== FLOATING BUTTONS ===== */}
      <Link to="/" className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_8px_30px_rgba(118,182,227,0.4)] hover:scale-110 transition-transform z-[100] group" aria-label="SmartCare Baby Assistant">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        <span className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-on-background text-on-primary text-body-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
          Chat with Assistant
        </span>
      </Link>

      <Link to="/emergency" className="fixed bottom-24 right-6 flex items-center gap-2 px-5 py-3 rounded-full bg-error text-on-error shadow-[0_8px_30px_rgba(186,26,26,0.35)] hover:scale-105 transition-transform z-[100] font-bold">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
        <span className="text-body-md">Emergency</span>
      </Link>

    </div>
  );
}

export default Home;