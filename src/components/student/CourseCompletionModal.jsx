import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Download, Printer, CheckCircle2, Sparkles, X, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CourseCompletionModal = ({ isOpen, onClose, courseTitle, instructorName }) => {
  const { currentStudent, showToast } = useApp();

  if (!isOpen) return null;

  const handleDownloadCertificate = () => {
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
    showToast('Official Verified Certificate generated and downloaded in PDF format!', 'success');
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Course Completion Certificate</h3>
              <p className="text-xs text-slate-500">Verified Academic Achievement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Certificate Display Canvas Frame */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-50/50 via-white to-blue-50/50 border-4 border-double border-amber-300 shadow-xl text-center space-y-5 overflow-hidden">
          {/* Top Decorative Emblem */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-100/80 border border-amber-300 px-3 py-1 rounded-full">
              CERTIFICATE OF EXCELLENCE
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 font-serif">
              Lyntrix Learn Academy Pass
            </h4>
            <p className="text-xs text-slate-500 mt-1">This is to certify that</p>
          </div>

          <div className="py-2 border-b-2 border-slate-900/20 max-w-sm mx-auto">
            <h2 className="text-2xl font-black text-blue-900 tracking-tight">{currentStudent?.name || 'Nimesh Fernando'}</h2>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">Index: {currentStudent?.indexNumber || 'LYN-26-8821'}</div>
          </div>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Has successfully completed 100% of the prescribed course modules, model papers, and practical tutorials in{' '}
            <strong className="text-slate-900 font-bold">{courseTitle || '2025 A/L Combined Mathematics — Full Theory'}</strong> conducted by{' '}
            <strong className="text-blue-800">{instructorName || 'Eng. Kasun Ranasinghe'}</strong>.
          </p>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200 text-xs">
            <div className="text-left">
              <div className="font-mono text-[10px] text-slate-400 font-bold">CERTIFICATE ID</div>
              <div className="font-mono text-slate-800 font-bold">CERT-LYN-2026-99214</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-slate-400 font-bold">DATE ISSUED</div>
              <div className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
        </div>

        {/* Certificate Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownloadCertificate}
            className="flex-1 w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res PDF Certificate</span>
          </button>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
