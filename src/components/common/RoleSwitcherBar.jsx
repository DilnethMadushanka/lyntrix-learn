import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, 
  GraduationCap, 
  UserCheck, 
  QrCode, 
  Sparkles,
  Languages
} from 'lucide-react';

export const RoleSwitcherBar = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    instructors, 
    currentTeacherId, 
    setCurrentTeacherId,
    students,
    currentStudentId,
    setCurrentStudentId,
    lang,
    setLang
  } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 py-2 text-xs shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Brand Identity & Live Mode Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-1 rounded-lg text-white font-black tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>LYNTRIX LEARN</span>
            <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">LMS</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-800 font-semibold text-[11px]">Multi-Master Platform</span>
          </div>
        </div>

        {/* Middle: Role Selector Tabs (Super Admin removed as requested) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 overflow-x-auto">
          <button
            onClick={() => setCurrentRole('landing')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-lg font-bold transition-all ${
              currentRole === 'landing'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Courses & Batches</span>
          </button>

          <button
            onClick={() => setCurrentRole('student')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-lg font-bold transition-all ${
              currentRole === 'student'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Hub</span>
          </button>

          <button
            onClick={() => setCurrentRole('teacher')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-lg font-bold transition-all ${
              currentRole === 'teacher'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sir Studio</span>
          </button>

          <button
            onClick={() => setCurrentRole('scanner')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-lg font-bold transition-all ${
              currentRole === 'scanner'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Scanner</span>
          </button>
        </div>

        {/* Right: Master/Student selector & Lang Toggle */}
        <div className="flex items-center gap-2">
          {/* Teacher Selector */}
          {currentRole === 'teacher' && (
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-emerald-800">
              <span className="text-[10px] text-emerald-600 font-bold uppercase">Sir:</span>
              <select
                value={currentTeacherId}
                onChange={(e) => setCurrentTeacherId(e.target.value)}
                className="bg-transparent text-emerald-900 font-bold text-xs focus:outline-none cursor-pointer"
              >
                {instructors.map(ins => (
                  <option key={ins.id} value={ins.id} className="bg-white text-slate-800">
                    {ins.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Student Selector */}
          {currentRole === 'student' && (
            <div className="flex items-center gap-1 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-lg text-cyan-800">
              <span className="text-[10px] text-cyan-600 font-bold uppercase">Student:</span>
              <select
                value={currentStudentId}
                onChange={(e) => setCurrentStudentId(e.target.value)}
                className="bg-transparent text-cyan-900 font-bold text-xs focus:outline-none cursor-pointer"
              >
                {students.map(std => (
                  <option key={std.id} value={std.id} className="bg-white text-slate-800">
                    {std.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition font-bold"
            title="Toggle English / Sinhala"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'en' ? 'EN' : 'සිං'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
