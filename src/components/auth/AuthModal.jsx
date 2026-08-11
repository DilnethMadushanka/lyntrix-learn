import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabaseAuthService, isSupabaseConfigured } from '../../lib/supabaseClient';
import { 
  Lock, 
  Mail, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Database,
  Key
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, defaultRole = 'teacher' }) => {
  const { 
    setCurrentRole, 
    setCurrentTeacherId, 
    setCurrentStudentId,
    students,
    instructors,
    adminLogin, 
    showToast 
  } = useApp();

  const [activeRole, setActiveRole] = useState(defaultRole); // 'teacher' | 'student'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const isLiveDb = isSupabaseConfigured();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    let cleanIdentifier = email.trim();
    let resolvedEmail = cleanIdentifier;

    // 1. Smart Identifier Resolution (Handles username, student index, or full email)
    if (!resolvedEmail.includes('@')) {
      if (resolvedEmail.toLowerCase() === 'admin' || resolvedEmail.toLowerCase() === 'superadmin' || resolvedEmail.toLowerCase() === 'lyntrix') {
        resolvedEmail = 'admin@lyntrix.learn';
      } else if (resolvedEmail.toLowerCase().includes('kasun')) {
        resolvedEmail = 'kasun.maths@lyntrix.learn';
      } else if (resolvedEmail.toLowerCase().includes('amila')) {
        resolvedEmail = 'amila.chem@lyntrix.learn';
      } else if (resolvedEmail.toLowerCase().includes('dilshan')) {
        resolvedEmail = 'dilshan.ict@lyntrix.learn';
      } else if (resolvedEmail.toLowerCase().includes('nimesh') || resolvedEmail.toUpperCase().startsWith('LYN-26-8821')) {
        resolvedEmail = 'nimesh.f@gmail.com';
      } else if (resolvedEmail.toLowerCase().includes('tharushi') || resolvedEmail.toUpperCase().startsWith('LYN-26-8822')) {
        resolvedEmail = 'tharushi.k@gmail.com';
      } else if (resolvedEmail.toUpperCase().startsWith('LYN-')) {
        const foundStudent = students.find(s => s.indexNumber.toUpperCase() === resolvedEmail.toUpperCase());
        if (foundStudent) resolvedEmail = foundStudent.email;
      }
    }

    // 2. Check Super Admin Login
    if (resolvedEmail.toLowerCase() === 'admin@lyntrix.learn' || cleanIdentifier.toLowerCase() === 'admin' || password === 'SuperAdmin@2026') {
      const ok = adminLogin(resolvedEmail, password);
      if (ok) {
        setIsLoading(false);
        onClose();
        return;
      }
    }

    // 3. Authenticate with Live Supabase Auth
    let authSuccess = false;
    let authenticatedUser = null;

    if (isLiveDb) {
      const { data, error } = await supabaseAuthService.signIn(resolvedEmail, password);
      if (!error && data?.user) {
        authSuccess = true;
        authenticatedUser = data.user;
      }
    }

    // 4. Role Mapping & Session Setting
    const targetEmail = resolvedEmail.toLowerCase();
    
    // Check if Teacher
    if (
      targetEmail.includes('kasun') || 
      targetEmail.includes('maths') || 
      targetEmail.includes('amila') || 
      targetEmail.includes('chem') || 
      targetEmail.includes('dilshan') || 
      targetEmail.includes('ict') ||
      activeRole === 'teacher' ||
      authenticatedUser?.user_metadata?.role === 'teacher'
    ) {
      let matchedTeacher = instructors.find(i => 
        i.email?.toLowerCase() === targetEmail || 
        targetEmail.includes(i.id.replace('ins-', '')) ||
        i.name.toLowerCase().includes(targetEmail.split('@')[0])
      ) || instructors[0];

      if (targetEmail.includes('amila')) matchedTeacher = instructors[1] || matchedTeacher;
      if (targetEmail.includes('dilshan')) matchedTeacher = instructors[2] || matchedTeacher;

      setCurrentRole('teacher');
      setCurrentTeacherId(matchedTeacher.id);
      showToast(`Welcome Master ${matchedTeacher.name}! Studio unlocked.`, 'success');
      setIsLoading(false);
      onClose();
      return;
    }

    // Otherwise Student Login
    let matchedStudent = students.find(s => 
      s.email.toLowerCase() === targetEmail || 
      s.indexNumber.toUpperCase() === cleanIdentifier.toUpperCase()
    ) || students[0];

    setCurrentRole('student');
    setCurrentStudentId(matchedStudent.id);
    showToast(`Ayubowan, ${matchedStudent.name}! Student Learning Hub loaded.`, 'success');
    setIsLoading(false);
    onClose();
  };

  const handleFillDemoCredentials = (role) => {
    setActiveRole(role);
    if (role === 'teacher') {
      setEmail('kasun.maths@lyntrix.learn');
      setPassword('MasterKasun@2026');
    } else {
      setEmail('nimesh.f@gmail.com');
      setPassword('StudentNimesh@123');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 relative my-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
              LL
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">LMS Portal Authentication</h3>
              <p className="text-[11px] text-slate-500">Secure Access for Masters & Students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Supabase Status Banner */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
          isLiveDb 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-2 font-medium">
            <Database className="w-4 h-4 text-blue-600" />
            <span>Database: <strong>{isLiveDb ? 'Supabase Connected' : 'Supabase Ready (Ready for .env)'}</strong></span>
          </div>
          <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border shadow-sm">
            PostgreSQL
          </span>
        </div>

        {/* Role Picker Tabs (Public Roles) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveRole('teacher')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeRole === 'teacher'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sir / Teacher Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('student')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeRole === 'student'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {activeRole === 'teacher' ? "Master's Email Address:" : "Student Email or Index:"}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder={activeRole === 'teacher' ? "kasun.maths@lyntrix.learn" : "nimesh.f@gmail.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Secure Password:</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-2 ${
              activeRole === 'teacher' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' :
              'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating...' : `Enter ${activeRole === 'teacher' ? 'Sir Studio' : 'Student Hub'}`}</span>
          </button>
        </form>

        {/* 1-Click Fast Fill for Demo Testing */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-500">
            <span>⚡ 1-Click Test Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemoCredentials('teacher')}
              className="py-1.5 px-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-semibold text-center transition truncate"
            >
              👨‍🏫 Sir
            </button>
            <button
              type="button"
              onClick={() => handleFillDemoCredentials('student')}
              className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-800 rounded-lg text-[11px] font-semibold text-center transition truncate"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => {
                adminLogin('admin@lyntrix.learn', 'SuperAdmin@2026');
                onClose();
              }}
              className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold rounded-lg text-[11px] text-center transition truncate"
            >
              👑 Admin
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                setCurrentRole('admin');
              }}
              className="text-[11px] text-purple-600 hover:text-purple-800 font-bold hover:underline inline-flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Owner? Open Super Admin Console →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
