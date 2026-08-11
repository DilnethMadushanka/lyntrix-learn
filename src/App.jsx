import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentPortal } from './components/student/StudentPortal';
import { AttendanceScannerTerminal } from './components/scanner/AttendanceScannerTerminal';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { CheckCircle2, AlertCircle, Info, GraduationCap } from 'lucide-react';

const AppContent = () => {
  const { currentRole, toast } = useApp();

  const isDashboardRole = currentRole === 'teacher' || currentRole === 'student';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 bg-mesh selection:bg-blue-600 selection:text-white">
      {/* 1. Multi-Tenant Role Switcher Bar */}
      <RoleSwitcherBar />

      {/* 2. Context Branded Navbar */}
      <Navbar />

      {/* 3. Main Workspace Layout */}
      {isDashboardRole ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Persistent LMS Left Sidebar */}
          <Sidebar />

          {/* Main Portal View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentRole === 'teacher' && <TeacherDashboard />}
            {currentRole === 'student' && <StudentPortal />}
          </main>
        </div>
      ) : (
        <main className="flex-1">
          {currentRole === 'landing' && <LandingPage />}
          {currentRole === 'scanner' && <AttendanceScannerTerminal />}
          {currentRole === 'admin' && <SuperAdminDashboard />}
        </main>
      )}

      {/* 4. Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-emerald-500/10' :
            toast.type === 'error' ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-rose-500/10' :
            'bg-blue-50 border-blue-300 text-blue-900 shadow-blue-500/10'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <span className="text-xs font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* 5. Modern LMS Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-800">Lyntrix Learn</span>
            <span>— Next-Gen Tuition & LMS Ecosystem</span>
          </div>
          <div className="text-slate-600 font-medium">
            Crafted with modern excellence for Sri Lankan Tuition Masters & Students
          </div>
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
