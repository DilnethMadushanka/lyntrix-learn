import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Video, 
  Package, 
  CreditCard, 
  QrCode, 
  Users, 
  Award, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    currentRole, 
    activeTab, 
    setActiveTab, 
    currentTeacher, 
    currentStudent, 
    bankSlips,
    setShowIdCardModal 
  } = useApp();

  if (currentRole === 'landing' || currentRole === 'scanner') return null;

  const pendingSlipsCount = bankSlips.filter(
    s => s.instructorId === currentTeacher.id && s.status === 'pending'
  ).length;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-105px)] sticky top-[105px] hidden md:flex shadow-sm">
      <div className="p-4 space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <img
            src={currentRole === 'teacher' ? currentTeacher.avatar : currentStudent.avatar}
            alt="Profile"
            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-sm"
          />
          <div className="overflow-hidden">
            <div className="font-bold text-slate-900 text-xs truncate">
              {currentRole === 'teacher' ? currentTeacher.name : currentStudent.name}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
              {currentRole === 'teacher' ? currentTeacher.subject : currentStudent.indexNumber}
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            {currentRole === 'teacher' ? 'Instructor LMS Studio' : 'Student Learning Hub'}
          </div>

          {currentRole === 'student' && (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Enrolled Classes</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('explore')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'explore'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Masters & Enroll</span>
                </div>
                <span className="text-[10px] bg-white text-blue-800 font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                  New
                </span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'videos'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4" />
                  <span>Video Classroom</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('deliveries')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'deliveries'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Tute Delivery Tracking</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </button>

              <button
                onClick={() => setActiveTab('quizzes')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'quizzes'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4" />
                  <span>Online Quizzes & Marks</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'payments'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Fees & Slip Upload</span>
                </div>
              </button>
            </>
          )}

          {currentRole === 'teacher' && (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Master Overview</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('batches')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'batches'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Batches & Curriculum</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('slips')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'slips'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Bank Slip Approvals</span>
                </div>
                {pendingSlipsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {pendingSlipsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'students'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Student CRM & Cards</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('live')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'live'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4" />
                  <span>Live Stream Studio</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('exams')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'exams'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>MCQ Papers & Exams</span>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                  MCQ
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Pass Card Widget */}
      <div className="p-4">
        {currentRole === 'student' && (
          <div 
            onClick={() => setShowIdCardModal(true)}
            className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-left cursor-pointer hover:border-blue-300 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Entrance Pass</span>
              <QrCode className="w-4 h-4 text-blue-600 group-hover:scale-110 transition" />
            </div>
            <div className="text-xs font-bold text-slate-900">Digital Student Card</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Tap to show QR barcode at hall gate.</p>
          </div>
        )}
      </div>
    </aside>
  );
};
