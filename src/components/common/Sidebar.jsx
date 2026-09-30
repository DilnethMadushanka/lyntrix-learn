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
  Radio,
  Compass
} from 'lucide-react';

const STUDENT_NAV = [
  { id: 'overview', label: 'My Enrolled Classes', icon: LayoutDashboard },
  { id: 'explore', label: 'Explore Masters & Enroll', icon: Compass },
  { id: 'videos', label: 'Video Classroom', icon: Video },
  { id: 'deliveries', label: 'Tute Delivery Tracking', icon: Package },
  { id: 'quizzes', label: 'Online Quizzes & Marks', icon: Award },
  { id: 'payments', label: 'Fees & Slip Upload', icon: CreditCard },
];

const TEACHER_NAV = [
  { id: 'overview', label: 'Master Overview', icon: LayoutDashboard },
  { id: 'batches', label: 'Batches & Curriculum', icon: BookOpen },
  { id: 'slips', label: 'Bank Slip Approvals', icon: CreditCard, badge: 'slips' },
  { id: 'students', label: 'Student CRM & Cards', icon: Users },
  { id: 'live', label: 'Live Stream Studio', icon: Radio },
  { id: 'exams', label: 'MCQ Papers & Exams', icon: Award },
];

const useNav = () => {
  const { currentRole, currentTeacher, bankSlips } = useApp();
  const pendingSlipsCount = bankSlips.filter(
    s => s.instructorId === currentTeacher.id && s.status === 'pending'
  ).length;
  const items = currentRole === 'teacher' ? TEACHER_NAV : STUDENT_NAV;
  return items.map(item => ({ ...item, count: item.badge === 'slips' ? pendingSlipsCount : 0 }));
};

export const Sidebar = () => {
  const {
    currentRole,
    activeTab,
    setActiveTab,
    currentTeacher,
    currentStudent,
    setShowIdCardModal
  } = useApp();
  const items = useNav();

  if (currentRole === 'landing' || currentRole === 'scanner') return null;

  const isTeacher = currentRole === 'teacher';

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between sticky top-16 h-[calc(100dvh-4rem)] border-r border-slate-200/80 py-6 pr-4">
      <div className="space-y-6">
        {/* Signed-in profile */}
        <div className="flex items-center gap-3 px-2">
          <img
            src={isTeacher ? currentTeacher.avatar : currentStudent.avatar}
            alt={isTeacher ? currentTeacher.name : currentStudent.name}
            className="w-10 h-10 rounded-xl object-cover bg-slate-200 ring-1 ring-slate-200"
          />
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 text-sm truncate">
              {isTeacher ? currentTeacher.name : currentStudent.name}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {isTeacher ? currentTeacher.subject : <span className="font-mono">{currentStudent.indexNumber}</span>}
            </div>
          </div>
        </div>

        <nav aria-label={isTeacher ? 'Studio sections' : 'Student sections'} className="space-y-0.5">
          {items.map(({ id, label, icon: Icon, count }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-current={active ? 'page' : undefined}
                className={`relative w-full flex items-center justify-between gap-2 pl-3 pr-2.5 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  active
                    ? 'bg-white text-slate-900 font-semibold shadow-soft ring-1 ring-slate-200/70'
                    : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-accent-600' : 'text-slate-400'}`} strokeWidth={1.75} />
                  <span className="truncate">{label}</span>
                </span>
                {count > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-md bg-rose-600 text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {currentRole === 'student' && (
        <button
          onClick={() => setShowIdCardModal(true)}
          className="group text-left p-4 rounded-xl bg-accent-900 text-accent-50 hover:bg-accent-800 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Digital student card</span>
            <QrCode className="w-4 h-4 text-accent-300 group-hover:text-accent-100 transition-colors" strokeWidth={1.75} />
          </div>
          <p className="text-xs text-accent-200/80 mt-1">Show the QR code at the hall gate.</p>
        </button>
      )}
    </aside>
  );
};

// Horizontal section switcher shown below md, where the sidebar is hidden.
export const MobileTabBar = () => {
  const { currentRole, activeTab, setActiveTab } = useApp();
  const items = useNav();
  if (currentRole !== 'teacher' && currentRole !== 'student') return null;

  return (
    <nav aria-label="Sections" className="md:hidden -mx-4 sm:-mx-6 mb-6 overflow-x-auto snap-x scroll-px-4 sm:scroll-px-6 [scrollbar-width:none]">
      <div className="flex gap-2 px-4 sm:px-6 w-max">
        {items.map(({ id, label, icon: Icon, count }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              aria-current={active ? 'page' : undefined}
              className={`snap-start shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                active ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{label}</span>
              {count > 0 && <span className="ml-0.5 px-1.5 rounded bg-rose-600 text-white text-[10px] tabular-nums">{count}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
