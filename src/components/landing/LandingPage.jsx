import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Video,
  ArrowRight,
  Star,
  ShieldCheck,
  QrCode,
  Receipt,
  Clock,
  Users,
  SearchX
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { AnimatedSection } from '../common/AnimatedSection';

const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&auto=format&fit=crop&q=80",
    stream: "Combined Mathematics",
    tagline: "Integral calculus and pure theory"
  },
  {
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&auto=format&fit=crop&q=80",
    stream: "Physics",
    tagline: "Mechanics, electricity and modern physics"
  },
  {
    url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1600&auto=format&fit=crop&q=80",
    stream: "Chemistry",
    tagline: "Organic synthesis and physical chemistry"
  },
  {
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80",
    stream: "A/L ICT",
    tagline: "Python, logic gates and databases"
  }
];

const SUBJECT_TABS = [
  { id: 'all', label: 'All subjects' },
  { id: 'maths', label: 'Combined Maths' },
  { id: 'physics', label: 'Physics' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'ict', label: 'ICT' },
];

const fieldClass = 'h-11 w-full bg-white ring-1 ring-slate-200 focus:ring-2 focus:ring-accent-500 rounded-lg text-sm text-slate-900 placeholder-slate-500 outline-none transition';

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
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Protected Zoom admission check
  const handleProtectedZoomAccess = ({ batchId, title, instructor }) => {
    if (currentRole !== 'student') {
      sound.playBuzzerError();
      showToast("Please log in to your student account to join this live class.", "error");
      setShowAuthModal(true);
      return;
    }

    const enrollment = currentStudent?.enrollments?.find(e => e.batchId === batchId || e.instructorId === instructor.id);
    if (!enrollment || enrollment.paymentStatus !== 'Paid') {
      sound.playBuzzerError();
      showToast("This month's class fee is due before you can enter the live room.", "error");
      setPaymentModalData({
        batch: { id: batchId, title: title || '2025 A/L Combined Maths', monthlyFee: instructor.monthlyFee || 3500 },
        instructor: instructor
      });
      return;
    }

    sound.playChimeApproved();
    window.open(instructor.batches[0]?.zoomLink || "https://zoom.us/j/9988221100", "_blank");
    showToast("Student pass verified. Opening the Zoom room.", "success");
  };

  // Protected course enrollment check
  const handleProtectedEnroll = (instructor) => {
    setCurrentTeacherId(instructor.id);
    if (currentRole !== 'student') {
      sound.playClick();
      showToast(`To enroll in ${instructor.name}'s batch, please log in or register a student account.`, 'info');
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

  const featured = instructors[0];
  const slide = HERO_SLIDES[slideIndex];

  return (
    <div className="relative overflow-x-hidden">
      {/* HERO: copy left, rotating subject photo right */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16 pb-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-5 min-w-0 space-y-7 animate-in">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight leading-[1.05] text-slate-900">
            Learn from Sri Lanka's top A/L teachers
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[46ch]">
            Join live Zoom classes, rewatch protected recordings, pay fees by bank slip and enter the hall with a QR pass.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#classes"
              className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold transition-colors"
            >
              Find a class
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => openPlanCheckout()}
              className="inline-flex items-center h-12 px-5 rounded-xl text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:ring-slate-400 hover:bg-white transition"
            >
              I'm a teacher
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 min-w-0 relative">
          <figure>
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-slate-200">
              {HERO_SLIDES.map((s, idx) => (
                <img
                  key={s.url}
                  src={s.url}
                  alt={`${s.stream} class`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === slideIndex ? 'opacity-100' : 'opacity-0'}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm sm:pl-[22rem] lg:pl-[21rem]">
              <span className="text-slate-600 truncate">
                <span className="font-medium text-slate-900">{slide.stream}</span>, {slide.tagline.toLowerCase()}
              </span>
              <span className="flex gap-1.5 shrink-0" role="tablist" aria-label="Hero photos">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.stream}
                    role="tab"
                    aria-selected={idx === slideIndex}
                    aria-label={s.stream}
                    onClick={() => setSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === slideIndex ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`}
                  />
                ))}
              </span>
            </figcaption>
          </figure>

          {/* Next live class, overlapping the photo */}
          {featured && (
            <div className="relative sm:absolute sm:bottom-2 sm:-left-8 lg:-left-12 mt-4 sm:mt-0 sm:w-[21rem] bg-white rounded-2xl shadow-lift ring-1 ring-slate-200/70 p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-rose-700">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-60"></span>
                  <span className="relative w-2 h-2 rounded-full bg-rose-500"></span>
                </span>
                Next live class
              </div>
              <h2 className="mt-2 text-base font-semibold text-slate-900 leading-snug">
                Combined Maths: Theory Masterclass (අනුකලනය)
              </h2>
              <p className="mt-1 text-sm text-slate-500">{featured.name}, Sunday 7:30 AM</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 font-mono">
                  <Clock className="w-4 h-4 text-slate-400" />
                  02h 45m
                </span>
                <button
                  onClick={() => handleProtectedZoomAccess({
                    batchId: 'd0000000-0000-0000-0000-000000000001',
                    title: 'Combined Maths: Theory Masterclass',
                    instructor: featured
                  })}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
                >
                  <Video className="w-4 h-4" />
                  Join class
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS: asymmetric bento, one large photo cell plus two tinted cells */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 max-w-[22ch]">
          Everything a tuition class runs on
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-5 md:grid-rows-2">
          <article className="md:col-span-3 md:row-span-2 relative rounded-2xl overflow-hidden bg-slate-900 min-h-[22rem] flex items-end">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&auto=format&fit=crop&q=80"
              alt="Students attending a lecture"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div className="relative p-6 sm:p-8 max-w-md">
              <ShieldCheck className="w-6 h-6 text-accent-300" strokeWidth={1.75} />
              <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-white">Recordings that stay yours</h3>
              <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                Every lesson plays with a moving watermark of the student's name and index number, so screen recordings trace back.
              </p>
            </div>
          </article>

          <article className="md:col-span-2 rounded-2xl bg-accent-50 ring-1 ring-accent-100 p-6 sm:p-7">
            <QrCode className="w-6 h-6 text-accent-700" strokeWidth={1.75} />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">QR pass at the hall gate</h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Students scan their digital ID. The terminal checks the month's fee and marks attendance on the spot.
            </p>
          </article>

          <article className="md:col-span-2 rounded-2xl bg-white ring-1 ring-slate-200 p-6 sm:p-7">
            <Receipt className="w-6 h-6 text-amber-600" strokeWidth={1.75} />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Bank slips, approved in one click</h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Upload a BOC, Commercial, Sampath or HNB deposit slip. Your teacher approves it and the class unlocks.
            </p>
          </article>
        </div>
      </AnimatedSection>

      {/* CLASS DIRECTORY */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div id="classes" className="scroll-mt-24">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Find your class</h2>
          <p className="mt-3 text-slate-600 max-w-[60ch]">Filter by subject, A/L year or teacher.</p>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-slate-100 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Subjects">
            {SUBJECT_TABS.map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                aria-selected={selectedSubject === id}
                onClick={() => setSelectedSubject(id)}
                className={`shrink-0 h-9 px-3.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedSubject === id ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 grid sm:grid-cols-[1fr_auto] gap-3">
            <div className="relative">
              <label htmlFor="catalog-search-input" className="sr-only">Search by teacher, unit or subject</label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="catalog-search-input"
                name="catalogSearchQuery"
                type="search"
                placeholder="Search by teacher, unit or subject"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${fieldClass} pl-10 pr-4`}
              />
            </div>
            <div>
              <label htmlFor="catalog-grade-select" className="sr-only">A/L year</label>
              <select
                id="catalog-grade-select"
                name="catalogGradeFilter"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className={`${fieldClass} px-3.5 sm:w-56`}
              >
                <option value="all">All A/L years</option>
                <option value="2025">2025 A/L (theory / revision)</option>
                <option value="2026">2026 A/L (theory)</option>
                <option value="2027">2027 A/L (new batch)</option>
              </select>
            </div>
          </div>
        </div>

        {filteredInstructors.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 py-16 px-6 text-center">
            <SearchX className="w-8 h-8 text-slate-400 mx-auto" strokeWidth={1.5} />
            <h3 className="mt-4 font-semibold text-slate-900">No classes match these filters</h3>
            <p className="mt-1 text-sm text-slate-500">Try another subject or clear the search.</p>
            <button
              onClick={() => { setSelectedSubject('all'); setSelectedGrade('all'); setSearchQuery(''); }}
              className="mt-5 h-10 px-4 rounded-lg ring-1 ring-slate-300 text-sm font-medium text-slate-800 hover:bg-white transition"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {filteredInstructors.map((ins) => {
              const primaryBatch = ins.batches[0];
              return (
                <article
                  key={ins.id}
                  className="group bg-white rounded-2xl ring-1 ring-slate-200/80 hover:ring-slate-300 hover:shadow-lift transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-200">
                    <img
                      src={ins.cover}
                      alt={`${ins.subject} class cover`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-accent-700">{ins.subject}</span>
                      <span className="text-slate-500">{primaryBatch?.gradeYear || '2026'} A/L</span>
                    </div>

                    <h3 className="mt-2 font-semibold text-slate-900 leading-snug line-clamp-2">
                      {primaryBatch?.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {primaryBatch?.description}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <img src={ins.avatar} alt={ins.name} className="w-9 h-9 rounded-lg object-cover bg-slate-200" loading="lazy" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{ins.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="tabular-nums">{ins.rating}</span>
                          <span>({ins.reviewsCount.toLocaleString()} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-5 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-500">Monthly fee</div>
                        <div className="text-lg font-semibold text-slate-900 tabular-nums">
                          LKR {ins.monthlyFee.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleProtectedEnroll(ins)}
                        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold transition-colors"
                      >
                        Enroll
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AnimatedSection>

      {/* TEACHERS: horizontal scroll strip */}
      <AnimatedSection className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 max-w-[24ch]">
            Teachers who produced island rankers
          </h2>
        </div>
        <div className="mt-10 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]">
          <div className="flex gap-5 w-max px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {instructors.map((ins) => (
              <figure key={ins.id} className="snap-start w-64 sm:w-72 shrink-0">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-200">
                  <img src={ins.avatar} alt={ins.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <figcaption className="mt-4">
                  <div className="font-semibold text-slate-900">{ins.name}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{ins.subject}</div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
                      <span className="tabular-nums">{ins.studentsCount.toLocaleString()}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="tabular-nums">{ins.rating}</span>
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FOR TEACHERS */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative grain rounded-2xl bg-accent-900 text-white overflow-hidden grid lg:grid-cols-2">
          <div className="relative p-8 sm:p-12 lg:p-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-[18ch]">
              Run your tuition class on Lyntrix
            </h2>
            <p className="mt-4 text-accent-100/80 max-w-[48ch] leading-relaxed">
              Your own subdomain, a slip approval queue, a gate scanner and protected video hosting. Plans start at LKR 4,500 a month.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openPlanCheckout()}
                className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-white text-accent-900 hover:bg-accent-50 text-sm font-semibold transition-colors"
              >
                See teacher plans
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentRole('teacher-login')}
                className="inline-flex items-center h-12 px-5 rounded-xl text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/10 transition-colors"
              >
                Teacher sign in
              </button>
            </div>
          </div>
          <div className="relative min-h-[16rem] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80"
              alt="A teacher writing on a whiteboard"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};
