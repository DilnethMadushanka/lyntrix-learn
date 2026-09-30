import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabaseAuthService, isSupabaseConfigured } from '../../lib/supabaseClient';
import { verifyStudentLogin, verifyTeacherLogin, isTeacherIdentifier, findInstructorByEmail } from '../../lib/demoAuth';
import { 
  GraduationCap, 
  UserCheck, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  QrCode, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  UserPlus,
  Key,
  ShieldCheck,
  Building,
  Truck
} from 'lucide-react';
import { SRI_LANKA_DISTRICTS, SUBJECT_CATEGORIES, GRADE_STREAMS } from '../../data/mockData';

export const AuthPage = ({ initialMode = 'login', initialRole = 'student', onComplete }) => {
  const { 
    registerStudent, 
    setCurrentRole, 
    setCurrentStudentId, 
    setCurrentTeacherId,
    students,
    instructors,
    adminLogin,
    showToast 
  } = useApp();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [role, setRole] = useState(initialRole); // 'student' | 'teacher'

  // Student Registration Form State
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    guardianPhone: '',
    batchYear: '2026 A/L',
    stream: 'Physical Science (Maths)',
    district: 'Colombo',
    address: '',
    password: '',
    confirmPassword: ''
  });

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    identifier: '', // Email or Student Index or Username
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isLiveDb = isSupabaseConfigured();

  // Handle Student Registration
  const handleStudentRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (!registerForm.phone || registerForm.phone.length < 9) {
      setError('Please provide a valid WhatsApp / Mobile Number.');
      return;
    }

    const email = registerForm.email.trim().toLowerCase();
    if (students.some(s => s.email?.toLowerCase() === email)) {
      setError('An account with this email already exists. Please log in instead.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLiveDb) {
        const { data, error: authError } = await supabaseAuthService.signUp(
          registerForm.email,
          registerForm.password,
          'student',
          {
            name: registerForm.name,
            phone: registerForm.phone,
            district: registerForm.district
          }
        );
        if (authError) {
          setError(authError.message);
          setIsLoading(false);
          return;
        }
      }

      // Add student to system context & generate dynamic index/QR pass
      const newStudent = registerStudent(registerForm);
      showToast(`Registration Successful! Assigned Index: ${newStudent.indexNumber}`, 'success');
      setCurrentRole('student');
      setIsLoading(false);
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.message || 'Registration failed. Please retry.');
      setIsLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const identifier = loginForm.identifier.trim();
      const lower = identifier.toLowerCase();

      // 1. Super admin
      if (lower === 'admin' || lower === 'admin@lyntrix.learn') {
        if (!adminLogin(identifier, loginForm.password)) {
          setError('Incorrect admin password.');
        } else if (onComplete) {
          onComplete();
        }
        return;
      }

      // 2. Live Supabase auth, when configured
      if (isLiveDb && identifier.includes('@')) {
        const { data, error: authError } = await supabaseAuthService.signIn(identifier, loginForm.password);
        if (!authError && data?.user) {
          if (data.user.user_metadata?.role === 'teacher') {
            const teacher = findInstructorByEmail(lower, instructors) || instructors[0];
            setCurrentTeacherId(teacher.id);
            setCurrentRole('teacher');
            showToast(`Logged in as ${teacher.name}`, 'success');
          } else {
            const student = students.find(s => s.email.toLowerCase() === lower) || students[0];
            setCurrentStudentId(student.id);
            setCurrentRole('student');
            showToast(`Welcome back, ${student.name}!`, 'success');
          }
          if (onComplete) onComplete();
          return;
        }
      }

      // 3. Demo accounts, with the password checked
      const asTeacher = role === 'teacher' || isTeacherIdentifier(identifier, instructors);
      const result = asTeacher
        ? verifyTeacherLogin(identifier, loginForm.password, instructors)
        : verifyStudentLogin(identifier, loginForm.password, students);

      if (result.status === 'not-found') {
        setError(asTeacher
          ? 'No teacher account uses this email address.'
          : 'No student account uses this email or index number.');
        return;
      }
      if (result.status === 'wrong-password') {
        setError('Incorrect password. Please try again.');
        return;
      }

      if (asTeacher) {
        setCurrentTeacherId(result.instructor.id);
        setCurrentRole('teacher');
        showToast(`Logged in as ${result.instructor.name}`, 'success');
      } else {
        setCurrentStudentId(result.student.id);
        setCurrentRole('student');
        showToast(`Welcome back, ${result.student.name}!`, 'success');
      }
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.message || 'Login failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 my-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-10 space-y-6 shadow-lift relative overflow-hidden">

        {/* Brand & Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            {mode === 'register' ? 'Student Registration Portal' : `${role === 'teacher' ? 'Sir Studio' : 'Student'} Login`}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'register' 
              ? 'Register once to get your Digital Student ID and access live Zoom & HD video classes.' 
              : 'Enter your account details to access course materials.'}
          </p>
        </div>

        {/* Mode & Role Switcher */}
        <div className="space-y-3">
          {/* Login vs Register Tab */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-soft ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setRole('student'); setError(''); }}
              className={`py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-soft ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>New Student Registration</span>
            </button>
          </div>

          {/* Role selector when in Login mode */}
          {mode === 'login' && (
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  role === 'student'
                    ? 'bg-white text-slate-900 shadow-soft ring-1 ring-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  role === 'teacher'
                    ? 'bg-white text-slate-900 shadow-soft ring-1 ring-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sir / Teacher</span>
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM 1: STUDENT REGISTRATION */}
        {mode === 'register' && (
          <form onSubmit={handleStudentRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name (සම්පූර්ණ නම):
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kasun Chamara Fernando"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
              />
            </div>

            {/* Email & WhatsApp Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address:</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Mobile:</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="077 123 4567"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm font-mono"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* A/L Batch & Stream */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">A/L Examination Year:</label>
                <select
                  value={registerForm.batchYear}
                  onChange={(e) => setRegisterForm({ ...registerForm, batchYear: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
                >
                  <option value="2025 A/L">2025 A/L (Theory / Revision)</option>
                  <option value="2026 A/L">2026 A/L (Theory Masterclass)</option>
                  <option value="2027 A/L">2027 A/L (Beginner Foundation)</option>
                  <option value="O/L Grade 11">O/L Grade 10/11 Batch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Study Stream (විෂය ධාරාව):</label>
                <select
                  value={registerForm.stream}
                  onChange={(e) => setRegisterForm({ ...registerForm, stream: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
                >
                  <option value="Physical Science (Combined Maths)">Physical Science (Combined Maths)</option>
                  <option value="Biological Science">Biological Science (Biology)</option>
                  <option value="Technology (ICT / Engineering)">Technology (Engineering & ICT)</option>
                  <option value="Commerce & Arts">Commerce & Arts</option>
                </select>
              </div>
            </div>

            {/* District & Tute Delivery Postal Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">District (දිස්ත්‍රික්කය):</label>
                <select
                  value={registerForm.district}
                  onChange={(e) => setRegisterForm({ ...registerForm, district: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
                >
                  {SRI_LANKA_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tute Delivery Address (මුද්‍රිත නිබන්ධන එවන ලිපිනය):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="No. 45, Temple Road, Kandy"
                    value={registerForm.address}
                    onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
                  />
                  <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password:</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password:</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
                />
              </div>
            </div>

            {/* Digital Card Preview Notice */}
            <div className="p-3.5 bg-accent-50/80 border border-accent-200 rounded-2xl flex items-center gap-3 text-xs text-accent-900">
              <QrCode className="w-6 h-6 text-accent-600 shrink-0" />
              <div>
                <div className="font-semibold">Instant Digital Student ID Generation</div>
                <p className="text-[11px] text-accent-700">A personalized QR Card & Student Index will be generated upon submit.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-soft transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'Creating Your Student Profile...' : 'Complete Student Registration'}</span>
            </button>
          </form>
        )}

        {/* FORM 2: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {role === 'teacher' ? "Master's Email Address:" : "Student Email Address or Index Number:"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={role === 'teacher' ? "kasun.maths@lyntrix.learn" : "nimesh.f@gmail.com or LYN-25-8821"}
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password:</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-accent-500 shadow-sm"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-xs font-semibold text-white shadow-soft transition flex items-center justify-center gap-2 ${
                role === 'teacher' 
                  ? 'bg-accent-600 hover:bg-accent-700' 
                  : 'bg-accent-600 hover:bg-accent-700'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : `Log In to ${role === 'teacher' ? 'Sir Studio' : 'Student Hub'}`}</span>
            </button>

            {/* Quick Helper for Testing */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500">
                <span>1-Click Test Accounts:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setLoginForm({ identifier: 'nimesh.f@gmail.com', password: 'StudentNimesh@123' });
                  }}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-accent-50 border border-slate-200 hover:border-accent-300 text-slate-700 hover:text-accent-800 rounded-lg text-[11px] font-semibold text-center transition"
                >
                  Student (Nimesh)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('teacher');
                    setLoginForm({ identifier: 'kasun.maths@lyntrix.learn', password: 'MasterKasun@2026' });
                  }}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-semibold text-center transition"
                >
                  Sir (Kasun Maths)
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
