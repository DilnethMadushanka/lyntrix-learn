import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  QrCode,
  AlertCircle,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  ArrowLeft,
  Menu,
  X,
  Languages,
  BookOpenCheck
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { Logo } from './Logo';

const ghostBtn = 'inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors';
const iconBtn = 'relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors';
const primaryBtn = 'inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-semibold bg-accent-600 hover:bg-accent-700 text-white transition-colors';

const Popover = ({ title, action, children }) => (
  <div className="absolute right-0 mt-2 w-80 bg-white ring-1 ring-slate-200 rounded-xl shadow-lift p-2 z-overlay animate-in">
    <div className="flex items-center justify-between px-2 py-1.5">
      <span className="text-sm font-semibold text-slate-900">{title}</span>
      {action}
    </div>
    <div className="max-h-64 overflow-y-auto">{children}</div>
  </div>
);

export const Navbar = () => {
  const {
    currentRole,
    setCurrentRole,
    setActiveTab,
    currentTeacher,
    currentStudent,
    bankSlips,
    setShowIdCardModal,
    setShowAuthModal,
    adminLogout,
    showToast,
    lang,
    setLang
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pendingSlipsCount = bankSlips.filter(
    s => s.instructorId === currentTeacher.id && s.status === 'pending'
  ).length;

  const handleStudentLogout = () => {
    sound.playClick();
    setCurrentRole('landing');
    showToast('Logged out of Student Hub', 'info');
  };

  const handleTeacherLogout = () => {
    sound.playClick();
    setCurrentRole('landing');
    showToast('Exited Sir Studio', 'info');
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'si' : 'en';
    setLang(nextLang);
    sound.playClick();
    showToast(`Language switched to ${nextLang === 'si' ? 'සිංහල' : 'English'}`, 'info');
  };

  const isPublic = currentRole === 'landing' || currentRole === 'auth' || currentRole === 'teacher-login';
  const suffix =
    currentRole === 'teacher' ? 'Studio' :
    currentRole === 'admin' ? 'Admin' :
    currentRole === 'scanner' ? 'Scanner' : 'Learn';

  return (
    <nav className="sticky top-0 z-nav bg-slate-50/85 backdrop-blur-xl border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand. Clicking it opens the teacher sign in gateway. */}
          <button
            onClick={() => {
              sound.playChimeApproved();
              setCurrentRole('teacher-login');
              showToast('Opening the teacher sign in page', 'info');
            }}
            className="shrink-0 rounded-lg"
            title="Teacher sign in"
          >
            <Logo suffix={suffix} />
          </button>

          <div className="flex items-center gap-1.5">
            {isPublic && (
              <div className="hidden lg:flex items-center relative mr-1">
                <label htmlFor="nav-search" className="sr-only">Search masters and subjects</label>
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="nav-search"
                  type="search"
                  placeholder="Search masters, subjects"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-56 bg-white ring-1 ring-slate-200 focus:ring-2 focus:ring-accent-500 rounded-lg pl-9 pr-3 text-sm text-slate-900 placeholder-slate-500 outline-none transition"
                />
              </div>
            )}

            <button onClick={toggleLanguage} className={`${ghostBtn} hidden sm:inline-flex`} title="Switch language">
              <Languages className="w-4 h-4" strokeWidth={1.75} />
              <span className="font-mono text-xs">{lang === 'en' ? 'EN' : 'සි'}</span>
            </button>

            {/* Public visitors */}
            {isPublic && (
              <>
                <button onClick={() => setCurrentRole('student')} className={`${ghostBtn} hidden md:inline-flex`}>
                  Student portal
                </button>
                <button onClick={() => setShowAuthModal(true)} className={`${primaryBtn} hidden md:inline-flex`}>
                  Log in
                </button>
              </>
            )}

            {/* Student */}
            {currentRole === 'student' && (
              <>
                <button onClick={() => setShowIdCardModal(true)} className={`${ghostBtn} hidden md:inline-flex`}>
                  <QrCode className="w-4 h-4" strokeWidth={1.75} />
                  <span>Student ID</span>
                </button>

                <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className={iconBtn} aria-label="Notifications" aria-expanded={showNotifications}>
                    <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  </button>
                  {showNotifications && (
                    <Popover
                      title="Notifications"
                      action={<button className="text-xs font-medium text-accent-700 hover:text-accent-800">Mark all read</button>}
                    >
                      <div className="p-2.5 rounded-lg hover:bg-slate-50">
                        <div className="text-sm font-medium text-slate-900">August theory lessons are open</div>
                        <p className="text-xs text-slate-500 mt-0.5">All video recordings and theory notes for August 2026 are unlocked.</p>
                      </div>
                    </Popover>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-1.5 pl-2 ml-1 border-l border-slate-200">
                  <img src={currentStudent.avatar} alt={currentStudent.name} className="w-8 h-8 rounded-lg object-cover bg-slate-200" />
                  <button onClick={handleStudentLogout} className={ghostBtn} title="Log out of Student Hub">
                    <LogOut className="w-4 h-4" strokeWidth={1.75} />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}

            {/* Teacher */}
            {currentRole === 'teacher' && (
              <>
                <button onClick={() => setCurrentRole('scanner')} className={`${ghostBtn} hidden md:inline-flex`}>
                  <QrCode className="w-4 h-4" strokeWidth={1.75} />
                  <span>Gate scanner</span>
                </button>

                <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className={iconBtn} aria-label="Studio alerts" aria-expanded={showNotifications}>
                    <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
                    {pendingSlipsCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 ring-2 ring-slate-50 text-[10px] font-semibold text-white flex items-center justify-center tabular-nums">
                        {pendingSlipsCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <Popover title="Studio alerts">
                      {pendingSlipsCount > 0 ? (
                        <button
                          onClick={() => { setActiveTab('slips'); setShowNotifications(false); }}
                          className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 flex gap-2.5"
                        >
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.75} />
                          <span>
                            <span className="block text-sm font-medium text-slate-900">{pendingSlipsCount} bank slips waiting</span>
                            <span className="block text-xs text-slate-500 mt-0.5">Review them to activate student admissions.</span>
                          </span>
                        </button>
                      ) : (
                        <p className="text-sm text-slate-500 p-3">No pending bank slips.</p>
                      )}
                    </Popover>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-1.5 pl-2 ml-1 border-l border-slate-200">
                  <img src={currentTeacher.avatar} alt={currentTeacher.name} className="w-8 h-8 rounded-lg object-cover bg-slate-200" />
                  <button onClick={handleTeacherLogout} className={ghostBtn} title="Exit Sir Studio">
                    <LogOut className="w-4 h-4" strokeWidth={1.75} />
                    <span>Exit</span>
                  </button>
                </div>
              </>
            )}

            {/* Super admin */}
            {currentRole === 'admin' && (
              <>
                <span className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 text-sm text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-accent-600" strokeWidth={1.75} />
                  Super admin
                </span>
                <button onClick={adminLogout} className={ghostBtn} title="Log out of the admin console">
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                  <span>Log out</span>
                </button>
              </>
            )}

            {/* Scanner terminal */}
            {currentRole === 'scanner' && (
              <>
                <span className="hidden sm:inline-flex items-center gap-2 h-9 px-3 text-sm text-slate-600">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-60"></span>
                    <span className="relative w-2 h-2 rounded-full bg-rose-500"></span>
                  </span>
                  Scanner live
                </span>
                <button onClick={() => setCurrentRole('teacher')} className={ghostBtn}>
                  <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
                  <span>Back to studio</span>
                </button>
              </>
            )}

            {(isPublic || currentRole === 'student' || currentRole === 'teacher') && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`${iconBtn} md:hidden`}
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-2 animate-in">
            {currentRole === 'student' && (
              <>
                <div className="flex items-center justify-between px-1 pb-2 text-sm">
                  <span className="font-medium text-slate-900">{currentStudent.name}</span>
                  <span className="font-mono text-xs text-slate-500">{currentStudent.indexNumber}</span>
                </div>
                <button
                  onClick={() => { setShowIdCardModal(true); setMobileMenuOpen(false); }}
                  className={`${primaryBtn} w-full justify-center h-11`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show student ID</span>
                </button>
                <button
                  onClick={() => { handleStudentLogout(); setMobileMenuOpen(false); }}
                  className={`${ghostBtn} w-full justify-center h-11 ring-1 ring-slate-200 bg-white`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </>
            )}

            {currentRole === 'teacher' && (
              <>
                <div className="px-1 pb-2">
                  <div className="text-sm font-medium text-slate-900">{currentTeacher.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{currentTeacher.id.replace('ins-', '')}.dilnethmadushanka.online</div>
                </div>
                <button
                  onClick={() => { setCurrentRole('scanner'); setMobileMenuOpen(false); }}
                  className={`${primaryBtn} w-full justify-center h-11`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Open gate scanner</span>
                </button>
                <button
                  onClick={() => { handleTeacherLogout(); setMobileMenuOpen(false); }}
                  className={`${ghostBtn} w-full justify-center h-11 ring-1 ring-slate-200 bg-white`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit studio</span>
                </button>
              </>
            )}

            {isPublic && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setCurrentRole('auth'); setMobileMenuOpen(false); }}
                  className={`${ghostBtn} justify-center h-11 ring-1 ring-slate-200 bg-white`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
                <button
                  onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }}
                  className={`${primaryBtn} justify-center h-11`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log in</span>
                </button>
                <button
                  onClick={() => { setCurrentRole('student'); setMobileMenuOpen(false); }}
                  className={`${ghostBtn} col-span-2 justify-center h-11`}
                >
                  <BookOpenCheck className="w-4 h-4" />
                  <span>Student portal</span>
                </button>
              </div>
            )}

            <button onClick={toggleLanguage} className={`${ghostBtn} w-full justify-center sm:hidden`}>
              <Languages className="w-4 h-4" />
              <span>{lang === 'en' ? 'සිංහල' : 'English'}</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
