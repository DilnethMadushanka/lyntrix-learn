import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabaseAuthService, isSupabaseConfigured } from '../../lib/supabaseClient';
import { 
  UserCheck, 
  Lock, 
  Mail, 
  Key, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { verifyTeacherLogin, findInstructorByEmail } from '../../lib/demoAuth';

export const TeacherLoginPage = () => {
  const { 
    setCurrentRole, 
    setCurrentTeacherId, 
    instructors, 
    showToast 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isLiveDb = isSupabaseConfigured();

  const handleTeacherLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const targetEmail = email.trim().toLowerCase();
      const targetPassword = password.trim();

      let authenticatedTeacher = null;

      // 1. Live Supabase Authentication safely
      if (isLiveDb) {
        try {
          const { data, error: authErr } = await supabaseAuthService.signIn(targetEmail, targetPassword);
          if (!authErr && data?.user) {
            authenticatedTeacher = findInstructorByEmail(targetEmail, instructors) || instructors[0];
          }
        } catch (authErr) {
          console.warn("Live Supabase Teacher Auth Exception handled safely:", authErr);
        }
      }

      // 2. Strict Local Credential Matching with Specific Error Messaging
      if (!authenticatedTeacher) {
        const result = verifyTeacherLogin(targetEmail, targetPassword, instructors);
        if (result.status === 'ok') {
          authenticatedTeacher = result.instructor;
        } else if (result.status === 'wrong-password') {
          sound.playBuzzerError();
          setError("Incorrect Password: The Master Security Password you entered is incorrect.");
          showToast("Incorrect Master Password", "error");
          return;
        } else {
          sound.playBuzzerError();
          setError("Master Account Not Found: No teacher profile exists with this Email Address.");
          showToast("Master Account Not Found", "error");
          return;
        }
      }

      sound.playChimeApproved();
      setCurrentTeacherId(authenticatedTeacher.id);
      setCurrentRole('teacher');
      showToast(`Ayubowan Master ${authenticatedTeacher.name}! Sir Studio Unlocked.`, 'success');
    } catch (err) {
      console.error("Teacher Login Error:", err);
      sound.playBuzzerError();
      setError("System Error: Unable to process teacher login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-8 shadow-lift space-y-6 relative overflow-hidden">

        {/* Back Button */}
        <button
          onClick={() => setCurrentRole('landing')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>

        {/* Header Insignia & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-accent-50 border border-accent-200 flex items-center justify-center text-accent-600 mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Sir Studio Gateway</h2>
          <p className="text-xs text-slate-500 font-medium">
            Exclusive Master Faculty Login Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Master Login Form */}
        <form onSubmit={handleTeacherLogin} className="space-y-4">
          <div>
            <label htmlFor="teacher-login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Master's Email Address:
            </label>
            <div className="relative">
              <input
                id="teacher-login-email"
                name="teacherEmail"
                type="email"
                required
                placeholder="kasun.maths@lyntrix.learn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label htmlFor="teacher-login-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Master's Secure Password:
            </label>
            <div className="relative">
              <input
                id="teacher-login-password"
                name="teacherPassword"
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-accent-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating Studio...' : 'Enter Sir Studio Portal'}</span>
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-1">
          <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-600" />
            <span>Protected 256-bit Encrypted Master Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
