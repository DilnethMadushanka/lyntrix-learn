import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Users, 
  Clock
} from 'lucide-react';

export const AttendanceScannerTerminal = () => {
  const { 
    currentTeacher, 
    markAttendanceByQR, 
    attendanceLogs, 
    students, 
    showToast 
  } = useApp();

  const [scanInput, setScanInput] = useState('');
  const [lastScanResult, setLastScanResult] = useState(null);

  const handleScanSubmit = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const result = markAttendanceByQR(scanInput.trim());
    setLastScanResult(result);
    setScanInput('');
  };

  const handleSimulateStudentScan = (student) => {
    const result = markAttendanceByQR(student.qrToken);
    setLastScanResult(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* 1. TERMINAL HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Live Gate Scanner Terminal
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">
              Entrance Card Reader & Fee Verifier
            </h1>
            <p className="text-xs text-slate-500">
              Active Station: <strong className="text-slate-800">{currentTeacher.name}</strong> • Batch: {currentTeacher.batches[0]?.code}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium">
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>Web Audio Feedback: <strong className="text-slate-900">Active</strong></span>
        </div>
      </div>

      {/* 2. SCANNER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Scanner Camera Mock & Input */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6 relative overflow-hidden">
            <div className="w-64 h-64 mx-auto bg-slate-900 border-2 border-dashed border-blue-400 rounded-3xl relative flex items-center justify-center overflow-hidden shadow-md">
              <div className="absolute w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow animate-laser-scan z-10"></div>
              
              <QrCode className="w-36 h-36 text-slate-700" />

              <div className="absolute bottom-3 inset-x-0 text-center">
                <span className="text-[10px] bg-black/80 px-3 py-1 rounded-full text-cyan-300 font-mono font-bold">
                  Align Student Card QR
                </span>
              </div>
            </div>

            {/* Manual / Barcode Input */}
            <form onSubmit={handleScanSubmit} className="space-y-3 max-w-md mx-auto">
              <label className="block text-xs font-bold text-slate-700">Scan Barcode / Enter Student Index:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. LYN-25-8821 or paste QR token..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Mark Scan
                </button>
              </div>
            </form>

            {/* 1-Click Test Scenarios */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                ⚡ 1-Click Student Test Scenarios:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {students.map((std) => (
                  <button
                    key={std.id}
                    onClick={() => handleSimulateStudentScan(std)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-center gap-2 group"
                  >
                    <img src={std.avatar} alt={std.name} className="w-7 h-7 rounded-lg object-cover" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {std.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{std.indexNumber}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scan Results & Logs */}
        <div className="lg:col-span-6 space-y-6">
          {lastScanResult ? (
            <div className={`p-6 rounded-3xl border transition-all animate-in zoom-in-95 ${
              lastScanResult.success
                ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                : 'bg-rose-50 border-rose-300 shadow-sm'
            }`}>
              <div className="flex items-start gap-4">
                {lastScanResult.success ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-10 h-10 text-rose-600 shrink-0" />
                )}

                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      lastScanResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {lastScanResult.success ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{new Date().toLocaleTimeString()}</span>
                  </div>

                  <p className="text-sm font-bold text-slate-900">{lastScanResult.message}</p>

                  {lastScanResult.student && (
                    <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                      <img
                        src={lastScanResult.student.avatar}
                        alt={lastScanResult.student.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900">{lastScanResult.student.name}</div>
                        <div className="text-slate-500 font-mono">{lastScanResult.student.indexNumber}</div>
                        <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                          Fee Status: <strong>{lastScanResult.feeStatus}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center text-slate-500 text-xs py-8">
              <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              Scan a student QR card or click one of the test buttons to mark attendance.
            </div>
          )}

          {/* Live History Feed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Today's Entrance Scans</h3>
              </div>
              <span className="text-xs text-blue-600 font-mono font-bold">
                {attendanceLogs.length} Records
              </span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {attendanceLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{log.studentName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {log.studentIndex} • {log.timestamp}
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    log.status.includes('Blocked')
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
