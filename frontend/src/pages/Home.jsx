// frontend/src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroAnimation from '../assets/momBaby.json';
import aboutAnimation from '../assets/about-animation.json';

const styles = `
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
  @keyframes floatSlow { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-25px) scale(1.03); } }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes blob {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  @keyframes bounceIn { 0% { opacity:0; transform: scale(0.3); } 50% { opacity:1; transform: scale(1.05); } 100% { transform: scale(1); } }
  @keyframes pulseDot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.2); } }

  .animate-float { animation: float 5s ease-in-out infinite; }
  .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
  .animate-blob { animation: blob 14s ease-in-out infinite; }
  .animate-pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
  .animate-slide-up { animation: slideInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .animated-gradient {
    background: linear-gradient(-45deg, #f8f9ff, #e5eeff, #ffe4f0, #d8ecff, #f8f9ff);
    background-size: 400% 400%;
    animation: gradientShift 18s ease infinite;
  }
  .text-gradient-primary {
    background: linear-gradient(135deg, #17648d 0%, #8a486f 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .glass-nav { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  .glass-nav-solid {
    background-color: rgba(248, 249, 255, 0.9);
    border-bottom: 1px solid rgba(192, 199, 207, 0.25);
    box-shadow: 0 4px 30px rgba(118, 182, 227, 0.08);
  }
  .card-3d { transform-style: preserve-3d; transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease; }
  .card-3d:hover { transform: translateY(-6px); box-shadow: 0 24px 50px -12px rgba(23, 100, 141, 0.18); }
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.15s; }
  .stagger-3 { animation-delay: 0.25s; }
  .stagger-4 { animation-delay: 0.35s; }
  .stagger-5 { animation-delay: 0.45s; }
`;

// ─────────────────────────────────────────────────────────────
// Animated Counter
// ─────────────────────────────────────────────────────────────
function AnimatedCounter({ end, duration = 1800, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime;
    const animate = (now) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(end);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────
function FloatingBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 -left-32 w-96 h-96 bg-secondary/20 animate-blob filter blur-3xl opacity-40"></div>
      <div className="absolute top-1/3 -right-32 w-[26rem] h-[26rem] bg-primary/20 animate-blob filter blur-3xl opacity-40" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-tertiary-fixed/30 animate-blob filter blur-3xl opacity-40" style={{ animationDelay: '6s' }}></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, easing: 'ease-out-cubic', once: true, offset: 60 });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex flex-col bg-background text-on-background font-body overflow-x-hidden animated-gradient">

        {/* ═══════════════════════════════════════════════════════ */}
        {/* NAVBAR */}
        {/* ═══════════════════════════════════════════════════════ */}
        <header className={`w-full sticky top-0 z-50 glass-nav transition-all duration-500 ${scrolled ? 'glass-nav-solid py-0' : 'bg-transparent py-2'}`}>
          <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-6xl mx-auto h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-primary text-3xl transition-transform duration-500 group-hover:rotate-[15deg]" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
              <h1 className="text-headline-md font-headline font-bold text-primary">SmartCare Baby</h1>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-body-md font-bold text-primary relative py-2">
                Home
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
              </Link>
              <a href="#services" className="text-body-md text-on-surface-variant hover:text-primary transition-colors py-2">Services</a>
              <a href="#how" className="text-body-md text-on-surface-variant hover:text-primary transition-colors py-2">How It Works</a>
              <a href="#about" className="text-body-md text-on-surface-variant hover:text-primary transition-colors py-2">About Us</a>
              <a href="#trust" className="text-body-md text-on-surface-variant hover:text-primary transition-colors py-2">Trust</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-body-md font-semibold text-primary hover:bg-primary/5 transition-colors px-4 py-2.5 rounded-full flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-body-md font-semibold hover:scale-105 transition-all shadow-[0_8px_30px_rgba(118,182,227,0.35)]"
              >
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>

          <div className={`md:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="glass-nav-solid px-6 py-4 flex flex-col gap-3">
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-body-md text-on-surface-variant py-2">Services</a>
              <a href="#how" onClick={() => setMobileMenuOpen(false)} className="text-body-md text-on-surface-variant py-2">How It Works</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-body-md text-on-surface-variant py-2">About Us</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="text-body-md text-on-surface-variant py-2">Trust</a>
              <div className="flex gap-3 pt-2 border-t border-outline-variant/30">
                <Link to="/login" className="flex-1 text-center border-2 border-primary text-primary py-2.5 rounded-full text-body-md font-semibold">Sign In</Link>
                <Link to="/register" className="flex-1 text-center bg-primary text-on-primary py-2.5 rounded-full text-body-md font-semibold">Sign Up</Link>
              </div>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════ */}
        <main className="flex-grow w-full relative">

          {/* ───── HERO ───── */}
          <section className="relative overflow-hidden">
            <FloatingBlobs />
            <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center z-10">
              <div className="flex flex-col gap-5">
                <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full w-max text-primary-dark shadow-[0_4px_20px_rgba(118,182,227,0.15)] animate-slide-up stagger-1">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-dot"></span>
                  <span className="text-label-md font-label-md">Nurturing Growth, Step by Step</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-on-background leading-[1.1] animate-slide-up stagger-2">
                  Smarter Care for
                  <br />
                  Every <span className="text-gradient-primary">Little Milestone</span>
                </h2>

                <p className="text-base md:text-lg font-body text-on-surface-variant max-w-lg leading-relaxed animate-slide-up stagger-3">
                  Your intuitive companion for monitoring your baby's development and tracking your pregnancy journey. Built with warmth, backed by expert guidance.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 animate-slide-up stagger-4">
                  <Link
                    to="/register"
                    className="bg-primary text-on-primary px-7 py-3.5 rounded-full text-body-md font-bold hover:scale-105 transition-all shadow-[0_8px_30px_rgba(118,182,227,0.4)]"
                  >
                    Start Your Journey
                  </Link>
                  <a
                    href="#about"
                    className="border-2 border-primary bg-white/60 backdrop-blur-sm text-primary px-7 py-3.5 rounded-full text-body-md font-bold hover:bg-white transition-all"
                  >
                    Learn More
                  </a>
                </div>

                <div className="flex items-center gap-2 pt-2 text-body-sm text-on-surface-variant animate-slide-up stagger-5">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <span>Backed by <strong className="text-on-surface">WHO</strong> & <strong className="text-on-surface">AAP</strong> guidelines</span>
                </div>
                
              </div>

              <div className="relative flex justify-center items-center animate-slide-up stagger-3">
                <div className="absolute inset-0 bg-secondary/20 rounded-full filter blur-[120px] opacity-40 -z-10 transform scale-110"></div>
                <div className="relative w-full max-w-sm animate-float-slow">
                  <Player autoplay loop src={heroAnimation} style={{ width: '100%', height: 'auto' }} />
                </div>
                <span className="absolute top-4 right-8 text-2xl animate-float"></span>
                <span className="absolute bottom-8 left-4 text-xl animate-float" style={{ animationDelay: '1.5s' }}>✨</span>
              </div>
            </div>

            <svg className="w-full block absolute bottom-0 left-0" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: '50px' }}>
              <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#eff4ff" />
            </svg>
          </section>

          {/* ───── STATS BAR ───── */}
          <section className="bg-surface-container-low py-10 md:py-12 relative">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: 10, suffix: '', label: 'Symptom Categories', icon: 'medical_services' },
                  { value: 16, suffix: '', label: 'Milestones Tracked', icon: 'flag' },
                  { value: 20, suffix: '', label: 'M-CHAT-R Questions', icon: 'psychology_alt' },
                  { value: 7, suffix: '', label: 'Developmental Areas', icon: 'category' },
                ].map((stat, i) => (
                  <div key={stat.label} className="text-center" data-aos="fade-up" data-aos-delay={i * 100}>
                    <span className="material-symbols-outlined text-primary text-2xl mb-1 inline-block" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                    <p className="text-2xl md:text-3xl font-headline font-extrabold text-gradient-primary mb-1">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-body-sm text-on-surface-variant">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───── ABOUT ───── */}
          <section id="about" className="py-14 md:py-20 relative overflow-hidden">
            <div className="absolute top-1/3 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-blob"></div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
              <div className="order-2 md:order-1 relative" data-aos="fade-right">
                <div className="relative w-full max-w-sm mx-auto bg-surface-container-lowest rounded-[2.5rem] p-6 shadow-[0_20px_60px_rgba(118,182,227,0.15)] animate-float-slow">
                  <Player autoplay loop src={aboutAnimation} style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>

              <div className="order-1 md:order-2 flex flex-col gap-4" data-aos="fade-left">
                <h3 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                  About Us 
                </h3>
                <p className="text-body-lg text-on-surface-variant leading-relaxed">
                  We are here to support you with trusted information, expert advice and simple guidance for a healthier pregnancy and a happier start for your baby.
                </p>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  SmartCare Baby brings together pregnancy tracking, milestone monitoring, symptom guidance, and specialist access — all in one intuitive companion designed for parents who want clarity and confidence.
                </p>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center border-2 border-primary text-primary px-6 py-3 rounded-full text-body-md font-bold hover:bg-primary/10 transition-colors w-max mt-2"
                >
                  Explore Our Services
                </a>
              </div>
            </div>
          </section>

          {/* ───── SERVICES ───── */}
          <section id="services" className="bg-surface-container-low py-14 md:py-20 relative overflow-hidden">
            <div className="absolute top-10 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-blob"></div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
              <div className="text-center max-w-3xl mx-auto flex flex-col gap-2 mb-10" data-aos="fade-up">
                <h3 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                  Our Services 
                </h3>
                <p className="text-lg font-body text-on-surface-variant">
                  Empowering your parenting journey with precision tools and expert care.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { icon: 'medical_services', color: 'primary', title: 'Baby Symptoms Tracker', desc: "Answer questions about your baby's symptoms, receive results, and access specialist guidance." },
                  { icon: 'verified', color: 'secondary', title: 'Milestone Tracker', desc: "Monitor your baby's developmental progress using M-CHAT-R screening and milestone tracking." },
                  { icon: 'pregnant_woman', color: 'primary', title: 'Pregnancy Tracker', desc: 'Track your pregnancy with Kick Counter, Contraction Timer, and Weight Tracker tools.' },
                  { icon: 'monitoring', color: 'secondary', title: 'Baby Growth Tracker', desc: "Monitor your baby's weight, height, and head circumference over time with visual charts." },
                  { icon: 'person_search', color: 'primary', title: 'Specialist Guidance', desc: 'Find suitable specialists with search, nearby toggle, and detailed doctor profiles.' },
                  { icon: 'vaccines', color: 'secondary', title: 'Vaccination Reminder', desc: "Never miss a vaccine dose with automated reminders based on your baby's age." },
                ].map((card, i) => (
                  <div
                    key={card.title}
                    className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.08)] flex flex-col gap-3 card-3d group h-full"
                    data-aos="fade-up"
                    data-aos-delay={100 * (i + 1)}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      card.color === 'primary'
                        ? 'bg-surface-container text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:rotate-12'
                        : 'bg-secondary/15 text-secondary group-hover:bg-secondary group-hover:text-on-primary group-hover:rotate-12'
                    }`}>
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                    </div>
                    <h4 className="text-headline-sm font-headline font-bold text-on-background">{card.title}</h4>
                    <p className="text-body-md font-body text-on-surface-variant flex-1 leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───── HOW IT WORKS ───── */}
          <section id="how" className="py-14 md:py-20">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto flex flex-col gap-2 mb-12" data-aos="fade-up">
                <h3 className="text-3xl md:text-4xl font-headline font-bold text-primary">How It Works</h3>
                <p className="text-lg font-body text-on-surface-variant">Get started in four simple steps.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { n: '01', icon: 'person_add', title: 'Create Account', desc: 'Sign up as a parent or expecting mother.' },
                  { n: '02', icon: 'child_care', title: 'Add Profile', desc: 'Add your baby or start pregnancy tracker.' },
                  { n: '03', icon: 'assignment_turned_in', title: 'Track Progress', desc: 'Complete assessments and monitor growth.' },
                  { n: '04', icon: 'support_agent', title: 'Get Guidance', desc: 'Access specialists, chatbot, and advice.' },
                ].map((step, i) => (
                  <div key={step.n} className="relative text-center group" data-aos="fade-up" data-aos-delay={150 * (i + 1)}>
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-[0_8px_30px_rgba(118,182,227,0.15)] mb-4 group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                      <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center shadow-md">
                        {step.n}
                      </span>
                    </div>
                    <h4 className="text-headline-sm font-headline font-bold text-on-background mb-1">{step.title}</h4>
                    <p className="text-body-sm font-body text-on-surface-variant">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───── TESTIMONIALS ───── */}
          <section className="bg-surface-container-low py-14 md:py-20 relative overflow-hidden">
            <div className="absolute top-10 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob"></div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
              <div className="text-center max-w-3xl mx-auto flex flex-col gap-2 mb-12" data-aos="fade-up">
                <h3 className="text-3xl md:text-4xl font-headline font-bold text-primary">What Parents Say </h3>
                <p className="text-lg font-body text-on-surface-variant">Real stories from moms and dads on their journey.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Sarah M.', role: 'Mom of 1', initial: 'S', color: 'bg-secondary-container text-on-secondary-container',
                    quote: "This website has been such a great help during my pregnancy. The information is easy to understand and so reassuring!" },
                  { name: 'Nimalika P.', role: 'Mom of 1', initial: 'N', color: 'bg-primary-container text-on-primary-container',
                    quote: "I love the symptom checker and baby development section. It answers all my questions as a first-time mom!" },
                  { name: 'Kasun D.', role: 'Dad of 1', initial: 'K', color: 'bg-tertiary-fixed text-on-tertiary-fixed',
                    quote: "Simple, clean and very user-friendly. I always come here for trusted advice and guidance." },
                ].map((t, i) => (
                  <div
                    key={t.name}
                    className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(118,182,227,0.08)] card-3d"
                    data-aos="fade-up"
                    data-aos-delay={120 * (i + 1)}
                  >
                    <div className="flex gap-0.5 text-secondary mb-3">
                      {[...Array(5)].map((_, j) => (
                        <span key={j} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    <p className="text-body-md text-on-surface-variant leading-relaxed italic mb-5">"{t.quote}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                      <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm`}>{t.initial}</div>
                      <div>
                        <p className="font-headline-sm text-body-md font-bold text-on-surface">{t.name}</p>
                        <p className="text-body-sm text-on-surface-variant">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───── GROWTH STAGES ───── */}
          <section className="py-14 md:py-20 relative">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto flex flex-col gap-2 mb-12" data-aos="fade-up">
                <h3 className="text-3xl md:text-4xl font-headline font-bold text-primary">Watch Your Little One Grow 💗</h3>
                <p className="text-lg font-body text-on-surface-variant">From tiny newborns to curious toddlers — the stages of your baby's development.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 relative">
                {[
                  { range: '0 – 1 Month', stage: 'Adjusting to the world', icon: 'child_care', bg: 'bg-primary-fixed' },
                  { range: '1 – 3 Months', stage: 'Building strength', icon: 'face_3', bg: 'bg-secondary-fixed' },
                  { range: '3 – 6 Months', stage: 'Discovering surroundings', icon: 'sentiment_satisfied', bg: 'bg-tertiary-fixed' },
                  { range: '6 – 12 Months', stage: 'Growing and learning', icon: 'directions_walk', bg: 'bg-primary-fixed' },
                ].map((s, i) => (
                  <div key={s.range} className="text-center group" data-aos="fade-up" data-aos-delay={120 * (i + 1)}>
                    <div className={`relative w-24 h-24 md:w-28 md:h-28 mx-auto ${s.bg} rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500 shadow-[0_8px_24px_rgba(118,182,227,0.15)]`}>
                      <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center text-label-md font-bold text-primary text-xs">
                        {i + 1}
                      </span>
                    </div>
                    <h4 className="text-headline-sm font-headline font-bold text-on-background mb-1">{s.range}</h4>
                    <p className="text-body-sm text-on-surface-variant">{s.stage}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───── SYMPTOM QUICK HELP ───── */}
          <section className="bg-surface-container-low py-14 md:py-20">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="flex flex-col gap-4" data-aos="fade-right">
                  <div className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-headline font-bold text-primary">Need Help with Symptoms? </h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Find information about common baby and pregnancy symptoms, causes, and care tips. Our guided checkers help you understand what to do next.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center border-2 border-primary text-primary px-6 py-3 rounded-full text-body-md font-bold hover:bg-primary/10 transition-colors w-max mt-2"
                  >
                    Check Your Symptoms
                  </Link>
                </div>

                <div className="md:col-span-2" data-aos="fade-left">
                  <div className="flex flex-wrap gap-3">
                    {[
                      { label: 'Fever', icon: 'thermostat', color: 'bg-error-container text-on-error-container' },
                      { label: 'Cough', icon: 'air', color: 'bg-primary-container/30 text-on-primary-container' },
                      { label: 'Colic', icon: 'sentiment_dissatisfied', color: 'bg-secondary-container text-on-secondary-container' },
                      { label: 'Rash', icon: 'face', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
                      { label: 'Vomiting', icon: 'medical_services', color: 'bg-error-container text-on-error-container' },
                      { label: 'Diarrhea', icon: 'water_drop', color: 'bg-primary-container/30 text-on-primary-container' },
                      { label: 'Poor Feeding', icon: 'no_meals', color: 'bg-secondary-container text-on-secondary-container' },
                      { label: 'Sleep Problems', icon: 'bedtime', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
                      { label: 'Fatigue', icon: 'hotel', color: 'bg-primary-container/30 text-on-primary-container' },
                      { label: 'Nausea', icon: 'sick', color: 'bg-secondary-container text-on-secondary-container' },
                    ].map((chip, i) => (
                      <Link
                        key={chip.label}
                        to="/login"
                        className={`${chip.color} px-4 py-2.5 rounded-full flex items-center gap-2 font-label-md text-label-md hover:scale-105 transition-transform shadow-[0_4px_12px_rgba(118,182,227,0.1)]`}
                        data-aos="fade-up"
                        data-aos-delay={80 * i}
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{chip.icon}</span>
                        {chip.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ───── TRUST / DISCLAIMER ───── */}
          <section id="trust" className="py-14 md:py-20 relative overflow-hidden">
            <div className="absolute top-1/3 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob"></div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-5 relative z-10" data-aos="fade-up">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center animate-float">
                <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-headline font-bold text-secondary">Your Trust, Our Priority</h3>
              <p className="text-lg font-body text-on-surface-variant max-w-2xl leading-relaxed">
                SmartCare Baby is designed to support and empower your parenting journey. We use industry-standard security to protect your family's data.
              </p>
              <div className="bg-white p-6 rounded-2xl border border-outline-variant max-w-3xl mt-2 shadow-[0_4px_20px_rgba(118,182,227,0.08)]">
                <p className="text-body-sm font-body text-tertiary leading-relaxed">
                  <strong>Medical Disclaimer:</strong> SmartCare Baby provides informational resources and tracking tools, not medical advice. The AI Assistant and screening tools do not diagnose medical conditions. Always consult with a qualified healthcare provider.
                </p>
              </div>
            </div>
          </section>

          {/* ───── CTA BANNER ───── */}
          <section className="py-14 md:py-20">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="relative bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] p-10 md:p-14 text-center overflow-hidden shadow-[0_30px_80px_rgba(118,182,227,0.35)]" data-aos="zoom-in">
                <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
                <div className="absolute top-6 right-10 text-3xl animate-float">✨</div>

                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-headline font-bold text-white mb-3">
                    Ready to Begin Your Journey?
                  </h3>
                  <p className="text-body-lg text-white/90 max-w-2xl mx-auto mb-7">
                    Join thousands of parents who trust SmartCare Baby to guide them through pregnancy and early childhood.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/register"
                      className="bg-white text-primary px-7 py-3.5 rounded-full text-body-md font-bold hover:scale-105 transition-all shadow-lg"
                    >
                      Create Free Account
                    </Link>
                    <Link
                      to="/login"
                      className="border-2 border-white text-white px-7 py-3.5 rounded-full text-body-md font-bold hover:bg-white/10 transition-all"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* FOOTER (Simplified) */}
        {/* ═══════════════════════════════════════════════════════ */}
        <footer className="w-full bg-surface border-t border-surface-container pt-14 pb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* Brand */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
                  <span className="text-headline-sm font-headline font-bold text-primary">SmartCare Baby</span>
                </div>
                <p className="text-body-sm font-body text-on-surface-variant leading-relaxed max-w-xs">
                  Empowering parents with gentle, intuitive tools for early childhood care and maternal health.
                </p>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col gap-3">
                <h4 className="text-label-md font-label-md text-tertiary uppercase tracking-wider mb-1">Quick Links</h4>
                <Link to="/" className="text-body-sm font-body text-on-surface-variant hover:text-primary transition-colors">Home</Link>
                <a href="#services" className="text-body-sm font-body text-on-surface-variant hover:text-primary transition-colors">Services</a>
                <a href="#about" className="text-body-sm font-body text-on-surface-variant hover:text-primary transition-colors">About Us</a>
                <Link to="/login" className="text-body-sm font-body text-on-surface-variant hover:text-primary transition-colors">Sign In</Link>
                <Link to="/register" className="text-body-sm font-body text-on-surface-variant hover:text-primary transition-colors">Get Started</Link>
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-3">
                <h4 className="text-label-md font-label-md text-tertiary uppercase tracking-wider mb-1">Contact</h4>
                <div className="flex items-start gap-3 text-body-sm font-body text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">location_on</span>
                  <span>Colombo, Sri Lanka</span>
                </div>
                <div className="flex items-center gap-3 text-body-sm font-body text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                  <a href="mailto:hello@smartcare.lk" className="hover:text-primary transition-colors">hello@smartcare.lk</a>
                </div>
                <div className="flex items-center gap-3 text-body-sm font-body text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                  <a href="tel:+94112345678" className="hover:text-primary transition-colors">+94 11 234 5678</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center border-t border-surface-container pt-6 gap-3">
              <p className="text-body-sm font-body text-tertiary">
                © 2024 SmartCare Baby. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-body-sm font-body text-tertiary">
                <span>Made with</span>
                <span className="text-secondary">💗</span>
                <span>for parents everywhere.</span>
              </div>
            </div>
          </div>
        </footer>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* FLOATING BUTTONS (Correctly Linked) */}
        {/* ═══════════════════════════════════════════════════════ */}
        <Link
          to="/login"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_8px_30px_rgba(118,182,227,0.5)] hover:scale-110 transition-transform z-[100] group"
          aria-label="SmartCare Baby Assistant"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          <span className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-on-background text-on-primary text-body-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            Chat with Assistant
          </span>
        </Link>

        <Link
          to="/emergency-login"
          className="fixed bottom-24 right-6 flex items-center gap-2 px-5 py-3 rounded-full bg-error text-on-error shadow-[0_8px_30px_rgba(186,26,26,0.4)] hover:scale-105 transition-transform z-[100] font-bold"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
          <span className="text-body-md">Emergency</span>
        </Link>
      </div>
    </>
  );
}

export default Home;