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
  Zap, 
  Lock, 
  Calendar,
  Clock,
  Star,
  ExternalLink,
  Package,
  FileText,
  Calculator,
  FlaskConical,
  Code2,
  Dna,
  Layers,
  GraduationCap
} from 'lucide-react';
import { SUBJECT_CATEGORIES, GRADE_STREAMS, SAAS_PRICING_PLANS } from '../../data/mockData';
import { sound } from '../../utils/soundEffects';

const HERO_BACKGROUND_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1600&auto=format&fit=crop&q=80",
    caption: "🎓 Professional Master Conducting Live Online Theory Lecture"
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80",
    caption: "💻 A/L Students Studying Together via HD Video Classroom"
  },
  {
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80",
    caption: "📐 Interactive Smartboard Mathematics Masterclass"
  },
  {
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=80",
    caption: "🎧 High-Speed HD Video Replays with Anti-Piracy Protection"
  },
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80",
    caption: "🏢 Modern Hall Gate QR Attendance Terminal"
  }
];

export const LandingPage = () => {
  const { 
    instructors, 
    setCurrentRole, 
    setCurrentTeacherId,
    setActiveLesson,
    currentRole,
    currentStudent,
    setPaymentModalData,
    setShowAuthModal,
    openPlanCheckout,
    lessons,
    platformMetrics,
    showToast
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacherModal, setSelectedTeacherModal] = useState(null);

  // Rotating Background Images Slideshow State
  const [currentHeroImgIndex, setCurrentHeroImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImgIndex(prev => (prev + 1) % HERO_BACKGROUND_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Protected Zoom Admission Check
  const handleProtectedZoomAccess = ({ batchId, title, instructor }) => {
    // 1. Must be logged in as a student
    if (currentRole !== 'student') {
      sound.playBuzzerError();
      showToast("🔒 Student Login Required: Please login to your Student Account to join Sir's Live Zoom class.", "error");
      setShowAuthModal(true);
      return;
    }

    // 2. Must have paid class fee for this batch
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

    // 3. Authenticated & Paid
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
    <div className="space-y-16 pb-28 bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
      {/* 1. LMS ACADEMIC HERO & ROTATING BACKGROUND SLIDESHOW */}
      <section className="relative pt-12 lg:pt-20 pb-12 overflow-hidden bg-slate-950 text-white border-b border-slate-800/80 shadow-2xl">
        {/* Dynamic Rotating Background Images Carousel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {HERO_BACKGROUND_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroImgIndex ? 'opacity-100 scale-105 transition-transform duration-[7500ms] ease-out' : 'opacity-0 scale-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Premium Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/80 to-slate-950/95 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-slate-950/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top LMS Pill Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold backdrop-blur-md shadow-lg shadow-blue-500/10">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Sri Lanka's #1 Multi-Instructor Tuition & LMS Platform</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-lg">
              Master Your A/L Syllabus with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Top Tuition Masters & Smart LMS
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
              Watch protected HD video lectures with dynamic watermarks, download printed theory tutes, attend live interactive Zoom classes, and track hall entrance attendance.
            </p>
          </div>

          {/* LMS Smart Search & Filter Bar */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-slate-900/90 p-2 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Master (e.g. Kasun Maths), Subject, or Batch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentRole('student')}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Portal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grade Stream Selector Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {GRADE_STREAMS.map(grade => (
              <button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md ${
                  selectedGrade === grade.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{grade.name}</span>
              </button>
            ))}
          </div>

          {/* Subject Category Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {SUBJECT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedSubject(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 backdrop-blur-md ${
                  selectedSubject === cat.id
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Live Background Image Slider Indicators & Caption */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-medium text-slate-300">{HERO_BACKGROUND_IMAGES[currentHeroImgIndex].caption}</span>
            </div>

            {/* Slide Navigation Dots */}
            <div className="flex items-center gap-1.5">
              {HERO_BACKGROUND_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentHeroImgIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentHeroImgIndex ? 'w-6 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE LECTURE COUNTDOWN RADAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/40 p-6 sm:p-7 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl backdrop-blur-xl text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Next Live Broadcast</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                2025 A/L Combined Maths — Theory Masterclass (අනුකලනය)
              </h3>
              <p className="text-xs text-slate-300">
                With <strong className="text-white">Eng. Kasun Ranasinghe</strong> • Sunday 7:30 AM • 1,840 Enrolled Students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-rose-500/30 text-xs font-mono font-bold text-rose-300 shadow-inner">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Starts in: 02h 45m</span>
            </div>
            <button
              onClick={() => handleProtectedZoomAccess({
                batchId: 'd0000000-0000-0000-0000-000000000001',
                title: '2025 A/L Combined Maths — Theory Masterclass (අනුකලනය)',
                instructor: instructors[0]
              })}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition flex items-center gap-2 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Enter Zoom Room</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. LMS MASTERCLASS CATALOG / COURSES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Explore Course Batches</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Official Masterclass Batches ({filteredInstructors.length} Masters)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select your master to access theory modules, weekly paper classes, and printed tutes.
            </p>
          </div>
        </div>

        {/* Master Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map(ins => {
            const primaryBatch = ins.batches[0];
            return (
              <div
                key={ins.id}
                className="bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between group shadow-xl backdrop-blur-xl text-white hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Course Cover Banner */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={ins.cover}
                    alt={ins.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold shadow">
                      {ins.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[10px] font-mono font-bold shadow border border-slate-700">
                      {primaryBatch?.grade}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-2 py-1 rounded-lg text-amber-400 text-xs font-bold flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 fill-current text-amber-400" />
                    <span>{ins.rating}</span>
                  </div>

                  {/* Instructor Pill at bottom */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                    <img
                      src={ins.avatar}
                      alt={ins.name}
                      className="w-10 h-10 rounded-xl object-cover border-2 border-slate-700 shadow-md"
                    />
                    <div>
                      <div className="text-white font-bold text-xs leading-tight flex items-center gap-1">
                        <span>{ins.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div className="text-[10px] text-slate-300 font-medium">{ins.title}</div>
                    </div>
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition line-clamp-1">
                      {primaryBatch?.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {primaryBatch?.description}
                    </p>
                  </div>

                  {/* Course Syllabus Features */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-blue-400" />
                      <span>{primaryBatch?.recordingCount}+ HD Lectures</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Printed Tute Delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Moving Watermark</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      <span>Hall QR Card Marking</span>
                    </div>
                  </div>

                  {/* Footer with Price & Actions */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly Class Fee</div>
                      <div className="text-lg font-black text-emerald-400">LKR {ins.monthlyFee.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleProtectedEnroll(ins)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20 flex items-center gap-1.5 active:scale-95"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Enroll in Batch</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW LYNTRIX LMS WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/80 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl text-white">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-white">How the Lyntrix LMS Ecosystem Works</h3>
            <p className="text-xs text-slate-400 mt-1">End-to-end learning flow for Sri Lankan tuition students and masters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20">
                01
              </div>
              <h4 className="font-bold text-white text-sm">Select Your Sir & Batch</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose from Combined Maths, Physics, Chemistry, and ICT masterclasses tailored for 2025/2026 A/L.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/20">
                02
              </div>
              <h4 className="font-bold text-white text-sm">Pay Online or Bank Slip</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pay instantly via card or upload your bank CDM deposit receipt for 1-click teacher verification.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-500/20">
                03
              </div>
              <h4 className="font-bold text-white text-sm">Watch Anti-Piracy Streams</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access full HD video classroom recordings with dynamic watermarks and download PDF notes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-rose-500/20">
                04
              </div>
              <h4 className="font-bold text-white text-sm">Digital QR Hall Pass</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Display your dynamic student QR ID at the hall entrance scanner for instant check-in beep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SAAS SUBSCRIPTION PLANS FOR TUITION MASTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-Master SaaS Infrastructure</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">Sell Your Classes on Lyntrix Learn</h3>
          <p className="text-xs text-slate-400 mt-1">Get your own branded academy portal with anti-piracy video CDN and slip approvals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAAS_PRICING_PLANS.map(plan => (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl flex flex-col justify-between backdrop-blur-xl border ${
                plan.popular 
                  ? 'bg-gradient-to-b from-blue-950/90 via-slate-900/95 to-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-500/20 relative' 
                  : 'bg-slate-900/90 border-slate-800 shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{plan.name}</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xs text-slate-400 font-semibold">LKR</span>
                  <span className="text-3xl font-black text-white">{plan.priceLKR}</span>
                  <span className="text-xs text-slate-400">{plan.billingCycle}</span>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => openPlanCheckout(plan)}
                className={`mt-6 w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg active:scale-95 ${
                  plan.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                <span>Create Your Sir Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
