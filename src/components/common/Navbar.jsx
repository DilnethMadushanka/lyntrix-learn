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
  LogIn
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

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
    lang
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const pendingSlipsCount = bankSlips.filter(
    s => s.instructorId === currentTeacher.id && s.status === 'pending'
  ).length;

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-[41px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / LMS Portal Identity */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentRole('landing')}
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-500 p-[1.5px] shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-slate-900">
                    Lyntrix
                  </span>
                  <span className="text-blue-600 font-black text-lg">Learn</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {currentRole === 'teacher' ? `${currentTeacher.name}'s Academy Studio` : 
                   currentRole === 'student' ? 'Student Learning Portal' :
                   currentRole === 'admin' ? 'Super Admin LMS Console' :
                   currentRole === 'scanner' ? 'QR Entrance Scanner' : 'Tuition Management Cloud'}
                </p>
              </div>
            </button>

            {/* Breadcrumb Subdomain Badge */}
            {currentRole === 'teacher' && (
              <div className="hidden md:flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Academy:</span>
                <code className="text-blue-900 font-mono font-bold">{currentTeacher.id.replace('ins-', '')}.lyntrix.learn</code>
              </div>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Login / Auth Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600" />
              <span>Portal Login</span>
            </button>

            {/* Student ID Pass Fast Button */}
            {currentRole === 'student' && (
              <button
                onClick={() => setShowIdCardModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">My Student ID Card</span>
              </button>
            )}

            {/* Teacher Fast QR Scanner trigger */}
            {currentRole === 'teacher' && (
              <button
                onClick={() => setCurrentRole('scanner')}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Open Hall Scanner</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
              >
                <Bell className="w-4 h-4" />
                {pendingSlipsCount > 0 && currentRole === 'teacher' && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    {pendingSlipsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">System Notifications</span>
                    <span className="text-[10px] text-blue-600 font-bold cursor-pointer">Mark read</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {currentRole === 'teacher' && pendingSlipsCount > 0 ? (
                      <div 
                        onClick={() => { setActiveTab('slips'); setShowNotifications(false); }}
                        className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs hover:bg-blue-100/60 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>{pendingSlipsCount} Pending Bank Slips</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">Students deposited bank slips for August month. Review and activate access.</p>
                      </div>
                    ) : null}

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Dynamic Anti-Piracy Active</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">All video streams protected with dynamic student watermark.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Status */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={
                  currentRole === 'teacher' ? currentTeacher.avatar :
                  currentRole === 'student' ? currentStudent.avatar :
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                }
                alt="Avatar"
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800">
                  {currentRole === 'teacher' ? currentTeacher.name :
                   currentRole === 'student' ? currentStudent.name :
                   currentRole === 'admin' ? 'Lyntrix Super Admin' : 'Demo User'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {currentRole === 'student' ? currentStudent.indexNumber :
                   currentRole === 'teacher' ? currentTeacher.subject : 'Platform Master'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultRole={currentRole === 'teacher' ? 'teacher' : 'student'}
      />
    </nav>
  );
};
