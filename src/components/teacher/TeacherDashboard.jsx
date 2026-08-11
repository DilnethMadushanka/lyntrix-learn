import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  DollarSign, 
  Video, 
  CheckCircle2, 
  Clock, 
  Plus, 
  CreditCard, 
  FileText, 
  Play, 
  QrCode, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Search,
  Eye,
  Check,
  X,
  Send,
  Calendar,
  Sparkles,
  UserPlus,
  Zap
} from 'lucide-react';
import { TeacherSubscriptionModal } from './TeacherSubscriptionModal';

export const TeacherDashboard = () => {
  const { 
    currentTeacher, 
    activeTab, 
    setActiveTab, 
    lessons, 
    addLesson, 
    bankSlips, 
    approveBankSlip, 
    rejectBankSlip, 
    students,
    addStudentByTeacher,
    attendanceLogs,
    setActiveLesson,
    showToast
  } = useApp();

  const [studentSearch, setStudentSearch] = useState('');
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedSlipModal, setSelectedSlipModal] = useState(null);

  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    phone: '',
    email: '',
    batchId: currentTeacher.batches[0]?.id || '',
    district: 'Colombo',
    paymentStatus: 'Paid'
  });

  const [newLessonForm, setNewLessonForm] = useState({
    title: '',
    unit: 'Pure Mathematics',
    batchId: currentTeacher.batches[0]?.id || '',
    duration: '2h 30m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    notesPdf: 'Class_Lecture_Notes_2025.pdf',
    description: ''
  });

  const teacherLessons = lessons.filter(l => l.instructorId === currentTeacher.id);
  const teacherSlips = bankSlips.filter(s => s.instructorId === currentTeacher.id);
  const pendingSlips = teacherSlips.filter(s => s.status === 'pending');
  
  const totalEnrolled = currentTeacher.batches.reduce((sum, b) => sum + b.enrolledCount, 0);
  const estimatedRevenue = (totalEnrolled * currentTeacher.monthlyFee);

  const handleCreateLesson = (e) => {
    e.preventDefault();
    if (!newLessonForm.title) {
      showToast("Please enter a lesson title", "error");
      return;
    }
    addLesson(newLessonForm);
    setShowAddLessonModal(false);
    setNewLessonForm({
      title: '',
      unit: 'Theory',
      batchId: currentTeacher.batches[0]?.id || '',
      duration: '2h 30m',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      notesPdf: 'Lecture_Notes.pdf',
      description: ''
    });
  };

  const handleRegisterStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.phone) {
      showToast("Please enter student name and phone number", "error");
      return;
    }

    addStudentByTeacher(newStudentForm);
    setShowAddStudentModal(false);
    setNewStudentForm({
      name: '',
      phone: '',
      email: '',
      batchId: currentTeacher.batches[0]?.id || '',
      district: 'Colombo',
      paymentStatus: 'Paid'
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 0. SAAS SUBSCRIPTION & FREE TRIAL BANNER (ADMIN AUTHORIZED) */}
      <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
        currentTeacher.subscription?.status === 'active' 
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-emerald-200' :
        currentTeacher.subscription?.status === 'trialing'
          ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200' :
          'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-md shrink-0 ${
            currentTeacher.subscription?.status === 'active' ? 'bg-emerald-600 text-white shadow-emerald-500/20' :
            currentTeacher.subscription?.status === 'trialing' ? 'bg-blue-600 text-white shadow-blue-500/20' :
            'bg-amber-600 text-white shadow-amber-500/20'
          }`}>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {currentTeacher.subscription?.status === 'active' 
                  ? `⭐ Active ${currentTeacher.subscription.tier} Subscription` :
                 currentTeacher.subscription?.status === 'trialing'
                  ? `🟢 Admin Authorized Trial (${currentTeacher.subscription.trialDaysLeft} Days Remaining)` :
                  '🔒 Trial Access Pending Admin Authorization'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                currentTeacher.subscription?.status === 'active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                currentTeacher.subscription?.status === 'trialing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {currentTeacher.subscription?.status === 'active' ? 'Paid Active' :
                 currentTeacher.subscription?.status === 'trialing' ? 'Free Trial Granted' : 'Approval Required'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {currentTeacher.subscription?.status === 'active'
                ? 'Your academy portal is running with full bandwidth and verified security.' :
               currentTeacher.subscription?.status === 'trialing'
                ? 'Super Admin has granted you a full-featured 14-day evaluation trial with watermark anti-piracy.' :
                'Free trial for this Academy must be authorized by Lyntrix Platform Admin.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSubscriptionModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>SaaS Subscription & Plans</span>
        </button>
      </div>

      {/* 1. TEACHER HERO BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentTeacher.avatar}
              alt={currentTeacher.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {currentTeacher.badge}
                </span>
                <span className="text-xs text-slate-500 font-mono">Master ID: {currentTeacher.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {currentTeacher.name}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-medium mt-0.5">
                {currentTeacher.title} • <span className="text-emerald-700 font-bold">{currentTeacher.subject}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddLessonModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Video Lecture</span>
            </button>

            <button
              onClick={() => setActiveTab('slips')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 transition relative"
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Bank Slips</span>
              {pendingSlips.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingSlips.length} New
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Active Students</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{totalEnrolled.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+142 this month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Est. Monthly Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">LKR {(estimatedRevenue / 1000).toFixed(0)}k</div>
          <div className="text-[11px] text-slate-500 mt-1">LKR {currentTeacher.monthlyFee} / student</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Pending Slips</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-3">{pendingSlips.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Requires 1-click approval</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Total Video Classes</span>
            <Video className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-700 mt-3">{teacherLessons.length + 30}</div>
          <div className="text-[11px] text-slate-500 mt-1">Watermark Protected</div>
        </div>
      </div>

      {/* 3. TAB VIEWS */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Batches & Next Live */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Class Alert Box */}
            <div className="bg-rose-50/80 border border-rose-200 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Live Scheduled Class</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">2025 A/L Combined Maths — Theory Masterclass</h3>
                <p className="text-xs text-slate-600">Sunday 7:30 AM • 1,840 Students Waiting</p>
              </div>
              <a
                href={currentTeacher.batches[0]?.zoomLink || "https://zoom.us"}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-600/20 transition"
              >
                <Video className="w-4 h-4" />
                <span>Start Zoom Class</span>
              </a>
            </div>

            {/* Active Batches List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Active Batches & Classes</h3>
                <span className="text-xs text-blue-600 font-bold">{currentTeacher.batches.length} Batches</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentTeacher.batches.map(batch => (
                  <div key={batch.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                        {batch.code}
                      </span>
                      <span className="text-xs text-emerald-600 font-bold">LKR {batch.monthlyFee}/mo</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{batch.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{batch.schedule}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span>{batch.enrolledCount.toLocaleString()} Students</span>
                      <span>{batch.recordingCount} Recordings</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Video Lessons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Published Video Lessons</h3>
                <button
                  onClick={() => setActiveTab('batches')}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {teacherLessons.slice(0, 3).map(lesson => (
                  <div key={lesson.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                        <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-current" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 line-clamp-1">{lesson.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{lesson.unit} • {lesson.duration}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pending Slip Queue & Recent Attendance */}
          <div className="space-y-6">
            {/* Pending Slip Approvals Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Pending Bank Slips</h3>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  {pendingSlips.length}
                </span>
              </div>

              {pendingSlips.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  All bank slips reviewed! Good job.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSlips.map(slip => (
                    <div key={slip.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{slip.studentName}</span>
                        <span className="text-xs text-emerald-600 font-bold">LKR {slip.amount}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{slip.studentIndex} • {slip.bank}</div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setSelectedSlipModal(slip)}
                          className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition text-center"
                        >
                          View Slip
                        </button>
                        <button
                          onClick={() => approveBankSlip(slip.id)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Hall Attendance Feed */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Recent Hall Scans</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold">Live Feed</span>
              </div>

              <div className="space-y-2.5">
                {attendanceLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{log.studentName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.studentIndex} • {log.timestamp}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      log.status.includes('Blocked')
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {log.status.includes('Blocked') ? 'Unpaid' : 'Present'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIPS APPROVAL TAB */}
      {activeTab === 'slips' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Bank Slip Approvals Queue</h2>
            <p className="text-xs text-slate-500">Review student uploaded bank deposit slips and activate instant class access.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherSlips.map(slip => (
              <div key={slip.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    slip.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    slip.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {slip.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{slip.depositDate}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">{slip.studentName}</h4>
                  <div className="text-xs text-blue-600 font-mono font-bold">{slip.studentIndex} • {slip.studentPhone}</div>
                  <div className="text-xs text-slate-500">{slip.batchTitle}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Amount Deposited:</span>
                  <span className="font-bold text-emerald-600 text-sm">LKR {slip.amount.toLocaleString()}</span>
                </div>

                <div 
                  onClick={() => setSelectedSlipModal(slip)}
                  className="h-36 bg-slate-100 rounded-xl overflow-hidden relative cursor-pointer border border-slate-200 group"
                >
                  <img src={slip.slipImage} alt="Deposit Slip" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="px-3 py-1.5 bg-black/80 rounded-lg text-xs font-bold text-white">Click to Zoom</span>
                  </div>
                </div>

                {slip.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => approveBankSlip(slip.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve (SMS)</span>
                    </button>
                    <button
                      onClick={() => rejectBankSlip(slip.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition border border-slate-200"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BATCHES & LESSONS TAB */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Batches & Video Lesson Vault</h2>
              <p className="text-xs text-slate-500">Manage course recordings, attached PDFs, and quizzes.</p>
            </div>
            <button
              onClick={() => setShowAddLessonModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherLessons.map(lesson => (
              <div key={lesson.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="relative aspect-video bg-slate-900">
                  <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover opacity-85" />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-white">
                    {lesson.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {lesson.unit}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{lesson.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lesson.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{lesson.date}</span>
                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play (Watermark)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENTS CRM TAB */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Student Enrollment & Fee Tracking</h2>
              <p className="text-xs text-slate-500">View payment records, attendance percentages, and dynamic QR tokens.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Name or Index..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Register Student</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Index No</th>
                    <th className="p-4">Phone / Contact</th>
                    <th className="p-4">Enrolled Batch</th>
                    <th className="p-4">August Fee</th>
                    <th className="p-4">Attendance</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.indexNumber.toLowerCase().includes(studentSearch.toLowerCase()))
                    .map(student => {
                      const enrollment = student.enrollments.find(e => e.instructorId === currentTeacher.id) || student.enrollments[0];
                      const status = enrollment?.paymentStatus || 'Overdue';
                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 flex items-center gap-3">
                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-xl object-cover" />
                            <div>
                              <div className="font-bold text-slate-900">{student.name}</div>
                              <div className="text-[10px] text-slate-500">{student.district}</div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-blue-700 font-bold">{student.indexNumber}</td>
                          <td className="p-4 text-slate-700">{student.phone}</td>
                          <td className="p-4 text-slate-700">{student.batch}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                              status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-700 font-semibold">{enrollment?.attendanceRate || 85}%</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => showToast(`SMS Reminder dispatched to ${student.phone}`, 'info')}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition border border-slate-200"
                            >
                              SMS Alert
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LIVE STREAM TAB */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6 max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <Video className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">Live Classroom Broadcasting Studio</h2>
              <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto">
                Schedule your next live Zoom lecture or unlisted YouTube stream. Students will automatically receive live notification alerts.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3">
              <label className="text-xs font-bold text-slate-700">Classroom Direct Zoom / Stream URL:</label>
              <input
                type="text"
                defaultValue={currentTeacher.batches[0]?.zoomLink || "https://zoom.us/j/98712345678"}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono shadow-sm"
              />
              <div className="text-[11px] text-slate-500">
                Lyntrix Learn embeds custom watermarks and validates monthly fee status before redirecting students.
              </div>
            </div>

            <button
              onClick={() => showToast("Live session broadcasted to 1,840 students!", "success")}
              className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition"
            >
              Start Live Broadcast Now
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Upload Video Lecture</h3>
              <button onClick={() => setShowAddLessonModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Lesson 35: Circular Motion & Past Papers"
                  value={newLessonForm.title}
                  onChange={(e) => setNewLessonForm({ ...newLessonForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch:</label>
                  <select
                    value={newLessonForm.batchId}
                    onChange={(e) => setNewLessonForm({ ...newLessonForm, batchId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    {currentTeacher.batches.map(b => (
                      <option key={b.id} value={b.id}>{b.code} - {b.title.slice(0, 20)}...</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration:</label>
                  <input
                    type="text"
                    value={newLessonForm.duration}
                    onChange={(e) => setNewLessonForm({ ...newLessonForm, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Video Stream URL (MP4 / HLS):</label>
                <input
                  type="text"
                  value={newLessonForm.videoUrl}
                  onChange={(e) => setNewLessonForm({ ...newLessonForm, videoUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Publish Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLIP ZOOM & REVIEW MODAL */}
      {selectedSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Bank Slip Verification</h3>
                <p className="text-xs text-slate-500">{selectedSlipModal.studentName} ({selectedSlipModal.studentIndex})</p>
              </div>
              <button onClick={() => setSelectedSlipModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="h-72 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={selectedSlipModal.slipImage}
                alt="Bank Slip Details"
                className="max-h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Bank & Branch:</span>
                <div className="font-bold text-slate-900">{selectedSlipModal.bank}</div>
              </div>
              <div>
                <span className="text-slate-500">Reference No:</span>
                <div className="font-bold text-blue-700 font-mono">{selectedSlipModal.referenceNo}</div>
              </div>
              <div>
                <span className="text-slate-500">Deposit Date:</span>
                <div className="font-bold text-slate-900">{selectedSlipModal.depositDate}</div>
              </div>
              <div>
                <span className="text-slate-500">Amount:</span>
                <div className="font-bold text-emerald-600">LKR {selectedSlipModal.amount}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  approveBankSlip(selectedSlipModal.id);
                  setSelectedSlipModal(null);
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Send SMS</span>
              </button>
              <button
                onClick={() => {
                  rejectBankSlip(selectedSlipModal.id);
                  setSelectedSlipModal(null);
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition border border-slate-200"
              >
                Reject Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT STUDENT ENROLLMENT MODAL BY TEACHER */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Enroll Student to Class</h3>
                  <p className="text-xs text-slate-500">Assign Index Number & Generate Dynamic QR Card</p>
                </div>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleRegisterStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone:</label>
                  <input
                    type="tel"
                    required
                    placeholder="077 123 4567"
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District:</label>
                  <select
                    value={newStudentForm.district}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Matara">Matara</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign Batch:</label>
                  <select
                    value={newStudentForm.batchId}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, batchId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    {currentTeacher.batches.map(b => (
                      <option key={b.id} value={b.id}>{b.code} - {b.title.slice(0, 18)}...</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fee Payment Status:</label>
                  <select
                    value={newStudentForm.paymentStatus}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, paymentStatus: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Paid">Paid (Active Full Pass)</option>
                    <option value="Pending">Pending Slip Verification</option>
                    <option value="Free / Scholarship">Free / Scholarship</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Enroll & Generate QR Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER SAAS SUBSCRIPTION & UPGRADE MODAL */}
      <TeacherSubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};
