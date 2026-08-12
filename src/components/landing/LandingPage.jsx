import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  BookOpen, 
  Video, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Users, 
  Award, 
  TrendingUp, 
  Lock, 
  Clock,
  Star,
  Package,
  FileText,
  ShieldCheck,
  Building,
  GraduationCap,
  ChevronRight,
  Zap
} from 'lucide-react';
import { SUBJECT_CATEGORIES, GRADE_STREAMS, SAAS_PRICING_PLANS } from '../../data/mockData';
import { sound } from '../../utils/soundEffects';
import { AnimatedSection } from '../common/AnimatedSection';

const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&auto=format&fit=crop&q=80",
    stream: "📐 Combined Mathematics",
    tagline: "Integral Calculus & Pure Theory Masterclass"
  },
  {
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&auto=format&fit=crop&q=80",
    stream: "⚡ Advanced Physics",
    tagline: "Mechanics, Electricity & Quantum Theory Lab"
  },
  {
    url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1600&auto=format&fit=crop&q=80",
    stream: "🧪 Chemistry Faculty",
    tagline: "Organic Syntheses & Physical Energetics"
  },
  {
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80",
    stream: "💻 A/L ICT & Computing",
    tagline: "Python Programming, Logic Gates & Databases"
  },
  {
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80",
    stream: "🏢 Hall Gate QR Terminal",
    tagline: "Automated Student Entrance & Fee Pass Verification"
  }
];

export const LandingPage = () => {
  const { 
    instructors, 
    setCurrentRole, 
    setCurrentTeacherId,
    currentRole,
    currentStudent,
    setPaymentModalData,
    setShowAuthModal,
    openPlanCheckout,
    showToast
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-rotating Hero Slideshow
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Scroll-Driven Dynamic Background Image Switching per Page Section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const scrollRatio = scrollY / totalHeight;

      if (scrollRatio < 0.22) {
        setActiveBgIndex(0); // Hero: Combined Maths / Physics Smartboard
      } else if (scrollRatio < 0.48) {
        setActiveBgIndex(1); // Course Directory: Chemistry & Lab Optics
      } else if (scrollRatio < 0.72) {
        setActiveBgIndex(2); // Faculty Spotlight: University Grand Auditorium
      } else if (scrollRatio < 0.88) {
        setActiveBgIndex(3); // SaaS Infrastructure: High-Tech Computing
      } else {
        setActiveBgIndex(4); // Footer & Bottom: Grand Ancient Library Stacks
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Protected Zoom Admission Check
  const handleProtectedZoomAccess = ({ batchId, title, instructor }) => {
    if (currentRole !== 'student') {
      sound.playBuzzerError();
      showToast("🔒 Student Login Required: Please login to your Student Account to join Sir's Live Zoom class.", "error");
      setShowAuthModal(true);
      return;
    }

    const enrollment = currentStudent?.enrollments?.find(e => e.batchId === batchId || e.instructorId === instructor.id);
    if (!enrollment || enrollment.paymentStatus !== 'Paid') {
      sound.playBuzzerError();
      showToast("🔒 Class Fee Required: Monthly tuition fee payment needed to enter Live Zoom room.", "error");
      setPaymentModalData({
        batch: { id: batchId, title: title || '2025 A/L Combined Maths', monthlyFee: instructor.monthlyFee || 3500 },
        instructor: instructor
      });
      return;
    }

    sound.playChimeApproved();
    window.open(instructor.batches[0]?.zoomLink || "https://zoom.us/j/9988221100", "_blank");
    showToast("✅ Verified Student Pass: Connecting to Live Zoom Room...", "success");
  };

  // Protected Course Enrollment Check
  const handleProtectedEnroll = (instructor) => {
    setCurrentTeacherId(instructor.id);
    if (currentRole !== 'student') {
      sound.playClick();
      showToast(`To enroll in ${instructor.name}'s batch, please login or register your student account.`, 'info');
      setShowAuthModal(true);
    } else {
      const primaryBatch = instructor.batches[0];
      const isPaid = currentStudent.enrollments.some(e => e.batchId === primaryBatch.id && e.paymentStatus === 'Paid');
      if (!isPaid) {
        setPaymentModalData({
          batch: primaryBatch,
          instructor: instructor
        });
      } else {
        setCurrentRole('student');
      }
    }
  };

  const filteredInstructors = instructors.filter(ins => {
    const matchesSubject = selectedSubject === 'all' || ins.subjectCategory === selectedSubject;
    const matchesSearch = ins.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ins.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ins.batches.some(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGrade = selectedGrade === 'all' || ins.batches.some(b => b.gradeYear === selectedGrade);
    return matchesSubject && matchesSearch && matchesGrade;
  });

  return (
    <div className="relative min-h-screen bg-[#090D16] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white overflow-x-hidden w-full max-w-full space-y-16 pb-24">
      
      {/* ========================================================================= */}
      {/* 1. SCROLL-DRIVEN SECTION DYNAMIC BACKGROUND SLIDESHOW WITH DARK GRADIENT */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeBgIndex || (idx === slideIndex && activeBgIndex === 0);
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-105 transition-transform duration-[7500ms] ease-out' : 'opacity-0 scale-100'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.stream}
                className="w-full h-full object-cover object-center"
              />
            </div>
          );
        })}

        {/* Deep Space Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/95 via-[#090D16]/85 to-[#090D16] backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/25 via-transparent to-[#090D16]"></div>
      </div>

      <div className="relative z-10 space-y-16">
        
        {/* ========================================================================= */}
        {/* 2. HERO SECTION WITH GRADIENT HEADLINE & INTERACTIVE RADAR */}
        {/* ========================================================================= */}
        <section className="pt-10 lg:pt-16 pb-8 text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Pill Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-2xl">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Sri Lanka's Premier Multi-Sir LMS • 2025/2026 A/L</span>
              </div>
            </div>

            {/* Glowing Gradient Headline with Animated Dynamic Changing Text */}
            <div className="max-w-4xl mx-auto space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-2xl min-h-[120px] sm:min-h-[150px]">
                Empowering Sri Lanka's Next Generation of{' '}
                <span key={slideIndex} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-400 animate-in fade-in slide-in-from-bottom-3 duration-700">
                  {[
                    "Doctors, Engineers & Innovators.",
                    "Island Rank 01 A/L Achievers.",
                    "Combined Maths & Physics Masters.",
                    "Chemistry & Biology Scholars.",
                    "Future Tech Leaders & IT Pioneers."
                  ][slideIndex]}
                </span>
              </h1>

              <p key={`sub-${slideIndex}`} className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium min-h-[48px] animate-in fade-in slide-in-from-bottom-2 duration-700">
                {[
                  "Attend live Zoom masterclasses, watch watermark-protected HD videos, submit paper answers for grading, and scan entrance pass QR codes.",
                  "Master Sri Lanka A/L Theory & Revision units with Island Top Tuition Masters and instant score feedback.",
                  "HD HLS video streaming, automated bank slip approvals, and hall gate laser barcode scanners.",
                  "Comprehensive theory modules, timed MCQ paper challenges, and verified completion certificates.",
                  "Islandwide rank-producing tuition masters empowered with custom SaaS subdomains and DRM video security."
                ][slideIndex]}
              </p>

              {/* High-Tech HUD Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/40 backdrop-blur-2xl border border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all duration-300 text-left flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                    🎓
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-amber-300 transition">Top 01% Master Faculty</div>
                    <div className="text-[10px] text-amber-400/90 font-medium">Island Rank 01 Produced</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/40 backdrop-blur-2xl border border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300 text-left flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                    🛡️
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition">4K Anti-Piracy DRM</div>
                    <div className="text-[10px] text-emerald-400/90 font-medium">Dynamic Watermarked HLS</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/40 backdrop-blur-2xl border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300 text-left flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                    🎟️
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition">Hall Gate QR Pass</div>
                    <div className="text-[10px] text-cyan-400/90 font-medium">Laser Entrance Barcode</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. INTERACTIVE LIVE RADAR BROADCAST COMMAND DECK */}
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-[#0F172A]/95 backdrop-blur-2xl text-white p-5 sm:p-6 rounded-3xl border border-rose-500/40 hover:border-rose-400 hover:shadow-[0_0_35px_rgba(244,63,94,0.3)] transition-all duration-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden group">
                <div className="flex items-center gap-4 text-left">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 border border-rose-400/40">
                      <Video className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="w-3 h-3 rounded-full bg-rose-500 border-2 border-slate-950 absolute -top-1 -right-1 animate-ping"></span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                        🔴 LIVE BROADCAST RADAR ACTIVE
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-rose-200 transition">
                      Combined Maths — Theory Masterclass (අනුකලනය)
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      Eng. Kasun Ranasinghe • Sunday 7:30 AM • <span className="text-emerald-400 font-bold">👨‍🎓 1,840 Active Students</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-2xl border border-amber-500/40 text-xs font-mono font-bold text-amber-300 shadow-inner">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Starts In: 02h 45m</span>
                  </div>

                  <button
                    onClick={() => handleProtectedZoomAccess({
                      batchId: 'd0000000-0000-0000-0000-000000000001',
                      title: 'Combined Maths — Theory Masterclass',
                      instructor: instructors[0]
                    })}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white rounded-2xl text-xs font-black transition-all duration-300 shadow-[0_0_25px_rgba(244,63,94,0.4)] active:scale-95 flex items-center gap-2 shrink-0 border border-rose-400/40"
                  >
                    <span>Enter Zoom Room</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. INTERACTIVE SUBJECT SPECIALIZATION CATALOG & SEARCH FILTERS */}
        {/* ========================================================================= */}
        <AnimatedSection delay={100} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-7 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gradient-indigo">
                    Sri Lankan A/L Master Directory
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Filter by Subject Stream, Batch Year (2025/2026/2027 A/L), or Tuition Master.
                  </p>
                </div>

                {/* Subject Stream Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
                  {['all', 'maths', 'physics', 'chemistry', 'ict'].map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSelectedSubject(subj)}
                      className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] transition ${
                        selectedSubject === subj ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {subj === 'all' ? 'All Streams' : subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-field Search Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 relative">
                  <input
                    type="text"
                    placeholder="Search by Master Name (Kasun, Nuwan...), Unit Title, or Subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/80 border border-indigo-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full bg-slate-950/80 border border-indigo-500/30 rounded-2xl px-4 py-3 text-xs text-white font-bold focus:outline-none"
                  >
                    <option value="all">All Batch Years (2025/2026/2027)</option>
                    <option value="2025">2025 A/L (Theory / Revision)</option>
                    <option value="2026">2026 A/L (Theory)</option>
                    <option value="2027">2027 A/L (New Batch)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ultra-Modern Glowing Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstructors.map((ins) => {
                const primaryBatch = ins.batches[0];
                return (
                  <div
                    key={ins.id}
                    className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-indigo-500/30 hover:border-indigo-400 hover:shadow-[0_0_35px_rgba(99,102,241,0.3)] transition-all duration-500 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5"
                  >
                    {/* Thumbnail Cover Image & Overlay Badges */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={ins.cover}
                        alt={ins.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-slate-950/50 to-transparent"></div>

                      {/* Glass Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-3 py-1 rounded-xl bg-slate-950/80 text-indigo-300 text-[10px] font-bold border border-indigo-400/50 backdrop-blur-md shadow-lg">
                            {ins.subject}
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-slate-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-500/50 backdrop-blur-md shadow-lg">
                            Year: {primaryBatch?.gradeYear || '2026'}
                          </span>
                        </div>

                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold backdrop-blur-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>4.9</span>
                        </span>
                      </div>

                      {/* Instructor Avatar & Verification */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={ins.avatar}
                              alt={ins.name}
                              className="w-11 h-11 rounded-xl object-cover border-2 border-indigo-500 shadow-xl"
                            />
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-slate-950 absolute -bottom-1 -right-1" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white group-hover:text-indigo-300 transition flex items-center gap-1">
                              <span>{ins.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-300 font-medium">{ins.title}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Content & Micro Features */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-indigo-300 transition">
                          {primaryBatch?.title}
                        </h3>
                        <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed font-medium">
                          {primaryBatch?.description}
                        </p>

                        {/* Micro Feature Indicators */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-slate-300">
                          <span className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                            <Video className="w-3 h-3 text-indigo-400" /> 4K DRM Replays
                          </span>
                          <span className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                            <FileText className="w-3 h-3 text-emerald-400" /> Theory Tutes
                          </span>
                        </div>
                      </div>

                      <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <div className="shrink-0">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tuition Fee</span>
                          <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                            LKR {ins.monthlyFee.toLocaleString()}
                            <span className="text-[10px] font-normal text-slate-400 font-sans">/mo</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleProtectedEnroll(ins)}
                          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-md shadow-indigo-500/25 active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-indigo-400/30"
                        >
                          <span>Enroll Batch</span>
                          <ChevronRight className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* ========================================================================= */}
        {/* 5. FACULTY SPOTLIGHT SHOWCASE CAROUSEL */}
        {/* ========================================================================= */}
        <AnimatedSection delay={150} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">
                Sri Lanka's Leading Master Faculty
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gradient-indigo">
                Learn from Island Rank 01 Producing Tuition Masters
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {instructors.map((ins) => (
                <div key={ins.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3 hover:border-indigo-500/50 transition group">
                  <img src={ins.avatar} alt={ins.name} className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-indigo-500/40 group-hover:scale-105 transition" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{ins.name}</h4>
                    <div className="text-xs text-indigo-400 font-bold mt-0.5">{ins.subject}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">{ins.studentsCount.toLocaleString()} Enrolled Students</div>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold pt-2 border-t border-slate-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{ins.rating} Rating ({ins.reviewsCount} reviews)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>



        {/* ========================================================================= */}
        {/* 6. FUTURISTIC DEEP SPACE GLASS FOOTER */}
        {/* ========================================================================= */}
        <footer className="bg-slate-950/90 backdrop-blur-2xl text-white pt-12 pb-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-slate-400">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center font-black text-xs">
                    LL
                  </div>
                  <span className="font-black text-base text-white">Lyntrix Learn</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Sri Lanka's preeminent tuition LMS platform empowering Sri Lankan A/L students with structured academic mastery.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-indigo-400 uppercase text-[11px] tracking-wider mb-2">Academic Policies</div>
                <div><a href="#terms" className="hover:text-white transition">Student Honor Code</a></div>
                <div><a href="#privacy" className="hover:text-white transition">Anti-Piracy & DRM Policy</a></div>
                <div><a href="#slips" className="hover:text-white transition">Bank Slip Approval Guidelines</a></div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-indigo-400 uppercase text-[11px] tracking-wider mb-2">Instructor Directory</div>
                <div><a href="#maths" className="hover:text-white transition">Combined Mathematics Masters</a></div>
                <div><a href="#physics" className="hover:text-white transition">Physics Department</a></div>
                <div><a href="#chem" className="hover:text-white transition">Chemistry Faculty</a></div>
                <div><a href="#ict" className="hover:text-white transition">A/L ICT School</a></div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-indigo-400 uppercase text-[11px] tracking-wider mb-2">Help & Support</div>
                <div><span>Hotline: +94 11 234 5678</span></div>
                <div><span>Email: support@lyntrix.learn</span></div>
                <div><span>Station: Colombo, Sri Lanka</span></div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-sans">
              <div>© 2026 Lyntrix Learn Technologies (Pvt) Ltd. All rights reserved.</div>
              <div className="flex gap-4">
                <span>🇱🇰 Sri Lanka National A/L Standard</span>
                <span>ISO/IEC 27001 Security Compliant</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
