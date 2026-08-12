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

    const cleanInput = cleanIdentifier.toLowerCase();

    // 1. Super Admin Login Check (Strict Exact Match)
    if (cleanInput === 'admin@lyntrix.learn' || cleanInput === 'admin') {
      const ok = adminLogin(cleanInput, password);
      if (ok) {
        setIsLoading(false);
        onClose();
        return;
      } else {
        sound.playBuzzerError();
        setErrorMessage("❌ Access Denied: Invalid Super Admin Security Password.");
        showToast("Access Denied: Invalid Admin Password", "error");
        setIsLoading(false);
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

    // 4. Registered Accounts (Strict Exact Email / Index + Password Verification)
    const REGISTERED_STUDENTS = [
      {
        identifier: 'nimesh.f@gmail.com',
        index: 'LYN-26-8821',
        passwords: ['StudentNimesh@123', 'nimesh123', '123456'],
        studentId: 'stu-001'
      },
      {
        identifier: 'tharushi.k@gmail.com',
        index: 'LYN-26-8822',
        passwords: ['StudentTharushi@123', 'tharushi123', '123456'],
        studentId: 'stu-002'
      }
    ];

    if (authSuccess && authenticatedUser) {
      sound.playChimeApproved();
      setCurrentRole('student');
      setCurrentStudentId(students[0].id);
      showToast(`Welcome! Authenticated via Live Supabase DB.`, 'success');
      setIsLoading(false);
      onClose();
      return;
    }

    const cleanIndex = cleanIdentifier.trim().toUpperCase();
    const inputPassword = password.trim();

    const matchedStudentAcc = REGISTERED_STUDENTS.find(s => 
      (s.identifier.toLowerCase() === cleanInput || s.index.toUpperCase() === cleanIndex) &&
      s.passwords.includes(inputPassword)
    );

    if (!matchedStudentAcc) {
      sound.playBuzzerError();
      setErrorMessage("❌ Access Denied: Invalid Student Email/Index or Password. Check your credentials.");
      showToast("Access Denied: Invalid Credentials", "error");
      setIsLoading(false);
      return;
    }

    const matchedStudentObj = students.find(s => s.id === matchedStudentAcc.studentId) || students[0];

    sound.playChimeApproved();
    setCurrentRole('student');
    setCurrentStudentId(matchedStudentObj.id);
    showToast(`Ayubowan, ${matchedStudentObj.name}! Student Hub unlocked.`, 'success');
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
              <h3 className="font-black text-slate-900 text-base">LMS Student Portal Login</h3>
              <p className="text-[11px] text-slate-500">Enter your registered student email or index number</p>
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

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Unified Clean Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address or Index Number:
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. nimesh.f@gmail.com or LYN-26-8821"
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
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating...' : 'Enter Student Portal'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
