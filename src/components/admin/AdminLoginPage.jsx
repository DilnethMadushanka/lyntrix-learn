import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const AdminLoginPage = () => {
  const { adminLogin, setCurrentRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = adminLogin(email.trim(), password);
      if (!success) {
        setError('Access Denied: Invalid Super Admin Credentials or Master Passcode.');
        sound.playBuzzerError();
      }
      setIsLoading(false);
    }, 400);
  };

  const handleFillAdminDemo = () => {
    setEmail('admin@lyntrix.learn');
    setPassword('SuperAdmin@2026');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-xl relative overflow-hidden">
        {/* Top Gradient Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>

        {/* Back Button */}
        <button
          onClick={() => setCurrentRole('landing')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main LMS</span>
        </button>

        {/* Header Badge & Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Super Admin Console</h2>
          <p className="text-xs text-slate-500">
            Protected Platform Gateway • Restricted Access Only
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email Address:</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@lyntrix.learn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-500 shadow-sm"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Master Security Password:</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-purple-500 shadow-sm"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isLoading ? 'Verifying Credentials...' : 'Unlock Super Admin Console'}</span>
          </button>
        </form>

        {/* Authorized Account Information */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <div className="text-[11px] text-slate-500 font-medium">
            Authorized System Access: <code className="text-purple-700 font-mono font-bold">admin@lyntrix.learn</code>
          </div>
        </div>
      </div>
    </div>
  );
};
