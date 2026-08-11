import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Bell, 
  Search, 
  CreditCard, 
  QrCode, 
  Video, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserCheck,
  UserPlus,
  LogOut,
  ShieldCheck,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const Navbar = () => {
  const { 
    currentRole, 
    setCurrentRole,
    activeTab,
    setActiveTab,
    currentTeacher, 
    currentStudent,
    bankSlips,
    setShowIdCardModal,
    setShowAuthModal,
    adminLogout,
    showToast,
    lang
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

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

  return (
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Left: Brand & Contextual Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentRole('landing')}
              className="flex items-center gap-3 group text-left"
            >
              <div className={`w-10 h-10 rounded-xl p-[1.5px] shadow-md group-hover:scale-105 transition ${
                currentRole === 'teacher' ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20' :
                currentRole === 'student' ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-blue-500/20' :
                currentRole === 'admin' ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-purple-500/20' :
                currentRole === 'scanner' ? 'bg-gradient-to-tr from-rose-600 to-orange-500 shadow-rose-500/20' :
                'bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-500 shadow-blue-500/20'
              }`}>
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  {currentRole === 'teacher' && <UserCheck className="w-5 h-5 text-emerald-600" />}
                  {currentRole === 'student' && <GraduationCap className="w-5 h-5 text-blue-600" />}
                  {currentRole === 'admin' && <ShieldCheck className="w-5 h-5 text-purple-600" />}
                  {currentRole === 'scanner' && <QrCode className="w-5 h-5 text-rose-600" />}
                  {(currentRole === 'landing' || currentRole === 'auth') && <GraduationCap className="w-5 h-5 text-blue-600" />}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-slate-900">
                    Lyntrix
                  </span>
                  <span className={`font-black text-lg ${
                    currentRole === 'teacher' ? 'text-emerald-600' :
                    currentRole === 'student' ? 'text-blue-600' :
                    currentRole === 'admin' ? 'text-purple-600' :
                    currentRole === 'scanner' ? 'text-rose-600' : 'text-blue-600'
                  }`}>
                    {currentRole === 'teacher' ? 'Studio' :
                     currentRole === 'student' ? 'Learn' :
                     currentRole === 'admin' ? 'Admin' :
                     currentRole === 'scanner' ? 'Scanner' : 'Learn'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate max-w-[180px] sm:max-w-none">
                  {currentRole === 'teacher' ? `${currentTeacher.name} • ${currentTeacher.subject}` : 
                   currentRole === 'student' ? `Student Portal (${currentStudent.name.split(' ')[0]})` :
                   currentRole === 'admin' ? 'Platform Super Admin Console' :
                   currentRole === 'scanner' ? 'Hall Gate Scanner Terminal' : 'Sri Lanka Multi-Master LMS'}
                </p>
              </div>
            </button>

            {/* Teacher Subdomain Pill */}
            {currentRole === 'teacher' && (
              <div className="hidden lg:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Subdomain:</span>
                <code className="text-emerald-900 font-mono font-bold">{currentTeacher.id.replace('ins-', '')}.lyntrix.learn</code>
              </div>
            )}

            {/* Student Index Pill */}
            {currentRole === 'student' && (
              <div className="hidden md:flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs text-blue-800 font-mono font-bold">
                <span>Index:</span>
                <span className="text-blue-600">{currentStudent.indexNumber}</span>
              </div>
            )}
          </div>

          {/* 2. Middle & Right: Strict Role-Specific Actions */}
          <div className="flex items-center gap-3">
            
            {/* =================================================== */}
            {/* A. PUBLIC / LANDING ROLE (Visitors / Unauthenticated) */}
            {/* =================================================== */}
            {(currentRole === 'landing' || currentRole === 'auth') && (
              <>
                <button
                  onClick={() => setCurrentRole('auth')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition border border-blue-200 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Student Register</span>
                </button>

                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              </>
            )}

            {/* =================================================== */}
            {/* B. STUDENT ROLE (Enrolled Student Hub)              */}
            {/* =================================================== */}
            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => setShowIdCardModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">My Digital Student ID</span>
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">Student Notifications</span>
                        <span className="text-[10px] text-blue-600 font-bold cursor-pointer">Mark all read</span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs">
                          <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>August Theory Active</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">All video recordings and theory notes unlocked for August 2026.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Student Avatar + Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={currentStudent.avatar}
                    alt={currentStudent.name}
                    className="w-8 h-8 rounded-xl object-cover border border-blue-200 shadow-sm"
                  />
                  <button
                    onClick={handleStudentLogout}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition"
                    title="Log out of Student Hub"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            )}

            {/* =================================================== */}
            {/* C. TEACHER / SIR ROLE (Master Studio)               */}
            {/* =================================================== */}
            {currentRole === 'teacher' && (
              <>
                <button
                  onClick={() => setCurrentRole('scanner')}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">QR Gate Scanner</span>
                </button>

                {/* Slip Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
                  >
                    <Bell className="w-4 h-4" />
                    {pendingSlipsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                        {pendingSlipsCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">Master Studio Alerts</span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {pendingSlipsCount > 0 ? (
                          <div 
                            onClick={() => { setActiveTab('slips'); setShowNotifications(false); }}
                            className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs hover:bg-blue-100/60 cursor-pointer transition"
                          >
                            <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                              <span>{pendingSlipsCount} Pending Bank Slips</span>
                            </div>
                            <p className="text-slate-600 text-[11px]">Click here to review and activate student admissions.</p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 p-2 text-center">No pending bank slips.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Teacher Avatar + Exit Studio */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={currentTeacher.avatar}
                    alt={currentTeacher.name}
                    className="w-8 h-8 rounded-xl object-cover border border-emerald-200 shadow-sm"
                  />
                  <button
                    onClick={handleTeacherLogout}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 transition"
                    title="Exit Sir Studio"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Exit</span>
                  </button>
                </div>
              </>
            )}

            {/* =================================================== */}
            {/* D. SUPER ADMIN ROLE                                 */}
            {/* =================================================== */}
            {currentRole === 'admin' && (
              <>
                <div className="hidden sm:flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-xs text-purple-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Super Admin Mode Active</span>
                </div>

                <button
                  onClick={adminLogout}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  title="Logout from Super Admin Console"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Admin Logout</span>
                </button>
              </>
            )}

            {/* =================================================== */}
            {/* E. SCANNER TERMINAL ROLE                            */}
            {/* =================================================== */}
            {currentRole === 'scanner' && (
              <>
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-xs text-rose-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Scanner Terminal Live</span>
                </div>

                <button
                  onClick={() => setCurrentRole('teacher')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Studio</span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};
