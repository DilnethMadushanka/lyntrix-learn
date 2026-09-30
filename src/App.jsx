import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar, MobileTabBar } from './components/common/Sidebar';
import { Logo } from './components/common/Logo';
import { LandingPage } from './components/landing/LandingPage';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentPortal } from './components/student/StudentPortal';
import { AttendanceScannerTerminal } from './components/scanner/AttendanceScannerTerminal';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AuthPage } from './components/auth/AuthPage';
import { AuthModal } from './components/auth/AuthModal';
import { TeacherPlanCheckoutModal } from './components/auth/TeacherPlanCheckoutModal';
import { FeePaymentModal } from './components/student/FeePaymentModal';
import { DigitalStudentCard } from './components/student/DigitalStudentCard';
import { TeacherLoginPage } from './components/auth/TeacherLoginPage';
import { CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { sound } from './utils/soundEffects';

const AppContent = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    isAdminAuthenticated, 
    toast,
    showAuthModal,
    setShowAuthModal,
    showPlanCheckoutModal,
    setShowPlanCheckoutModal,
    selectedCheckoutPlan,
    showToast
  } = useApp();

  // Secret Hotkey Listener for Sir Studio Access (Ctrl + Shift + S)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        sound.playChimeApproved();
        showToast("Secret Master Gateway Unlocked!", "success");
        setCurrentRole('teacher-login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isDashboardRole = currentRole === 'teacher' || currentRole === 'student';

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-slate-900 w-full max-w-full relative">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-toast focus:px-3 focus:py-2 focus:rounded-lg focus:bg-white focus:shadow-lift focus:text-sm">
        Skip to content
      </a>

      <Navbar />

      {isDashboardRole ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <Sidebar />
          <main id="main" className="flex-1 min-w-0 py-6 md:pl-8 lg:pl-10">
            <MobileTabBar />
            {currentRole === 'teacher' && <TeacherDashboard />}
            {currentRole === 'student' && <StudentPortal />}
          </main>
        </div>
      ) : (
        <main id="main" className="flex-1">
          {currentRole === 'landing' && <LandingPage />}
          {currentRole === 'auth' && <AuthPage />}
          {currentRole === 'teacher-login' && <TeacherLoginPage />}
          {currentRole === 'scanner' && <AttendanceScannerTerminal />}
          {currentRole === 'admin' && (
            isAdminAuthenticated ? <SuperAdminDashboard /> : <AdminLoginPage />
          )}
        </main>
      )}

      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-toast animate-in">
          <div className="flex items-start gap-3 pl-3.5 pr-4 py-3 rounded-xl bg-slate-900 text-white shadow-lift sm:max-w-sm">
            {toast.type === 'success' && <CheckCircle2 className="w-[18px] h-[18px] text-emerald-400 shrink-0 mt-px" strokeWidth={2} />}
            {toast.type === 'error' && <AlertCircle className="w-[18px] h-[18px] text-rose-400 shrink-0 mt-px" strokeWidth={2} />}
            {toast.type === 'info' && <Info className="w-[18px] h-[18px] text-accent-300 shrink-0 mt-px" strokeWidth={2} />}
            <span className="text-sm leading-snug">{toast.message}</span>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <TeacherPlanCheckoutModal
        isOpen={showPlanCheckoutModal}
        onClose={() => setShowPlanCheckoutModal(false)}
        initialPlan={selectedCheckoutPlan}
      />

      <FeePaymentModal />
      <DigitalStudentCard />

      <footer className="border-t border-slate-200/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <Logo />
            <span>Tuition classes for Sri Lankan A/L students and teachers.</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="#terms" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="mailto:support@lyntrix.learn" className="hover:text-slate-900 transition-colors">Support</a>
            <button
              onClick={() => setCurrentRole('admin')}
              className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
              title="Platform administrator login"
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
              <span>Admin login</span>
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-xs text-slate-400">
          &copy; 2026 Lyntrix Learn Technologies (Pvt) Ltd.
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
