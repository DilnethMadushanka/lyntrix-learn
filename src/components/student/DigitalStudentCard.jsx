import React from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Sparkles, ShieldCheck, CheckCircle2, Download, Printer } from 'lucide-react';
import { LogoMark } from '../common/Logo';

export const DigitalStudentCard = () => {
  const { currentStudent, showIdCardModal, setShowIdCardModal, showToast } = useApp();

  if (!showIdCardModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-lift animate-in zoom-in-95 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-accent-700 font-semibold text-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>OFFICIAL STUDENT ENTRANCE PASS</span>
          </div>
          <button
            onClick={() => setShowIdCardModal(false)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-semibold"
          >
            ✕
          </button>
        </div>

        {/* HOLOGRAPHIC LIGHT PASS CARD CONTAINER */}
        <div className="relative rounded-2xl p-6 overflow-hidden border border-accent-200 bg-gradient-to-br from-accent-50/80 via-white to-slate-50 shadow-lift">
          {/* Top Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoMark className="w-8 h-8 shrink-0" />
              <div>
                <div className="font-semibold text-xs tracking-wider text-slate-900">LYNTRIX LEARN</div>
                <div className="text-[9px] text-accent-700 font-semibold">SMART ID & ATTENDANCE CARD</div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>ACTIVE 2026</span>
            </span>
          </div>

          {/* Student Details & Photo */}
          <div className="mt-6 flex items-center gap-4">
            <div className="relative">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-accent-500 shadow-soft"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-slate-900 text-base leading-tight">{currentStudent.name}</h3>
              <div className="text-xs font-mono text-accent-700 font-semibold">{currentStudent.indexNumber}</div>
              <div className="text-[11px] text-slate-600 font-medium">{currentStudent.batch}</div>
              <div className="text-[10px] text-slate-400">NIC: {currentStudent.nic}</div>
            </div>
          </div>

          {/* QR Code & Barcode Section */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between gap-4">
            {/* Dynamic QR Box */}
            <div className="w-24 h-24 bg-white p-1.5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
              <div className="w-full h-full bg-slate-900 p-1 rounded-xl flex items-center justify-center relative overflow-hidden">
                <QrCode className="w-full h-full text-white" />
              </div>
            </div>

            {/* Barcode & Instructions */}
            <div className="flex-1 space-y-2 text-right">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Attendance Token:</div>
              <div className="font-mono text-xs text-accent-800 font-semibold bg-accent-50 border border-accent-200 px-2 py-1 rounded inline-block">
                {currentStudent.qrToken}
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Scan this card at the entrance gate scanner or hall check-in counter.
              </p>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Student ID Card exported as PDF image!", "success")}
            className="flex-1 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Card</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition border border-slate-200"
            title="Print ID Card"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
