import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Video, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Play, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Calendar,
  ChevronRight,
  ExternalLink,
  Search,
  Award,
  Package,
  Truck,
  MapPin,
  Download
} from 'lucide-react';
import { DigitalStudentCard } from './DigitalStudentCard';
import { VideoClassroom } from './VideoClassroom';
import { FeePaymentModal } from './FeePaymentModal';
import { QuizExamPlayer } from './QuizExamPlayer';

export const StudentPortal = () => {
  const { 
    currentStudent, 
    instructors, 
    lessons, 
    activeTab, 
    setActiveTab, 
    setActiveLesson,
    quizzes,
    setActiveQuiz,
    bankSlips,
    setPaymentModalData,
    setShowIdCardModal,
    showToast
  } = useApp();

  const [lessonFilter, setLessonFilter] = useState('All');

  const studentSlips = bankSlips.filter(s => s.studentId === currentStudent.id);

  const handleOpenPayment = (batch, instructor) => {
    setPaymentModalData({ batch, instructor });
  };

  return (
    <div className="space-y-8 pb-24">
      {/* 1. STUDENT WELCOME BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {currentStudent.batch}
                </span>
                <span className="text-xs font-mono text-slate-500">Index: {currentStudent.indexNumber}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Ayubowan, {currentStudent.name}! 👋
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                District: <strong className="text-slate-800">{currentStudent.district}</strong> • Active Term: <span className="text-blue-600 font-bold">{currentStudent.activeMonth}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowIdCardModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Show Entrance QR Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB VIEWS */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Enrolled Courses & Live Classes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Class Timetable Banner */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                  <h3 className="font-bold text-slate-900 text-sm">Upcoming Live Class Schedule</h3>
                </div>
                <span className="text-xs text-blue-600 font-bold">August 2026</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-rose-700 font-bold">Sunday 7:30 AM (Live Broadcast)</div>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">2025 A/L Combined Maths — Theory Masterclass</h4>
                  <div className="text-xs text-slate-600 mt-1">Instructor: Eng. Kasun Ranasinghe</div>
                </div>

                <a
                  href="https://zoom.us"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-600/20 shrink-0"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Live Zoom</span>
                </a>
              </div>
            </div>

            {/* My Enrolled Batches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">My Enrolled Subjects & Fee Status</h3>
                <span className="text-xs text-slate-500">{currentStudent.enrollments.length} Enrolled Batches</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentStudent.enrollments.map((enr, idx) => {
                  const teacher = instructors.find(i => i.id === enr.instructorId) || instructors[0];
                  const batch = teacher.batches.find(b => b.id === enr.batchId) || teacher.batches[0];
                  const isPaid = enr.paymentStatus === 'Paid';
                  const isPending = enr.paymentStatus === 'Pending';

                  return (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-600 font-bold">{teacher.subject}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            isPending ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {enr.paymentStatus}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mt-2">{batch.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{teacher.name}</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        {/* Course Progress */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span>Syllabus Completed</span>
                            <span className="font-bold text-slate-900">{enr.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${enr.progress}%` }}></div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        {isPaid ? (
                          <button
                            onClick={() => {
                              const lesson = lessons.find(l => l.instructorId === teacher.id) || lessons[0];
                              setActiveLesson(lesson);
                            }}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch Classroom Lectures</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenPayment(batch, teacher)}
                            className="w-full py-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{isPending ? 'Review / Upload New Slip' : 'Pay August Fee (LKR 3,500)'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Quick Stats & Digital Pass Mini Preview */}
          <div className="space-y-6">
            {/* Holographic ID Pass Mini Banner */}
            <div 
              onClick={() => setShowIdCardModal(true)}
              className="bg-white p-6 rounded-3xl border border-blue-200 text-center space-y-4 cursor-pointer group hover:border-blue-400 transition shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Dynamic Student ID Pass</h4>
                <p className="text-xs text-slate-500 mt-1">Tap to open full card with QR code for hall attendance scanner.</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                <span>View Full Pass</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>

            {/* Recent Uploaded Slips Status */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">My Bank Slips Status</h4>

              {studentSlips.length === 0 ? (
                <div className="text-xs text-slate-500">No bank slips submitted yet.</div>
              ) : (
                <div className="space-y-3">
                  {studentSlips.map(slip => (
                    <div key={slip.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{slip.bank}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          slip.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          slip.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {slip.status}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono">Ref: {slip.referenceNo} • LKR {slip.amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELIVERIES TAB */}
      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Monthly Printed Tute & Material Deliveries</h2>
            <p className="text-xs text-slate-500">Track physical theory books and model paper couriers delivered to your doorstep.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentStudent.enrollments.map((enr, i) => {
              const teacher = instructors.find(ins => ins.id === enr.instructorId);
              const delivery = enr.tuteDelivery;

              return (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600">{teacher?.subject}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      delivery?.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      delivery?.status === 'Dispatched' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {delivery?.status || 'Pending Dispatch'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{delivery?.packTitle || "August Theory Tute Pack"}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{teacher?.name}</p>
                      {delivery && (
                        <div className="text-[11px] text-slate-500 font-mono mt-1">
                          Courier: <strong className="text-slate-800">{delivery.courier}</strong> • Tracking: <span className="text-blue-600 font-bold">{delivery.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2 text-xs text-slate-700">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate">{currentStudent.address}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIDEOS TAB */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Video Classroom & Lesson Vault</h2>
            <p className="text-xs text-slate-500">All lectures are streamed with dynamic watermark security to protect master content.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map(lesson => (
              <div key={lesson.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition">
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
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
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Lesson</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Class Fee Management & Bank Slip Gateway</h2>
            <p className="text-xs text-slate-500">Pay fees online or upload deposit slips for teacher approval.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map(teacher => {
              const batch = teacher.batches[0];
              const enrollment = currentStudent.enrollments.find(e => e.instructorId === teacher.id);
              const isPaid = enrollment?.paymentStatus === 'Paid';

              return (
                <div key={teacher.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600">{teacher.subject}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isPaid ? 'Paid (Active)' : 'August Unpaid'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img src={teacher.avatar} alt={teacher.name} className="w-12 h-12 rounded-2xl object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{teacher.name}</h4>
                        <div className="text-xs text-slate-500">{batch?.code}</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Monthly Fee:</span>
                      <span className="font-bold text-emerald-600">LKR {teacher.monthlyFee}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenPayment(batch, teacher)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isPaid ? 'Renew for Next Month' : 'Pay / Upload Slip'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Online Timed MCQ Tests & Leaderboard</h2>
            <p className="text-xs text-slate-500">Simulate exam conditions with countdown timers and instant grading.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {quiz.subject}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{quiz.durationMinutes} Minutes</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{quiz.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {quiz.questions.length} MCQ Questions • Total Marks: {quiz.totalMarks}
                  </p>
                </div>

                <button
                  onClick={() => setActiveQuiz(quiz)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Start MCQ Challenge</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Sub-components / Modals */}
      <DigitalStudentCard />
      <VideoClassroom />
      <FeePaymentModal />
      <QuizExamPlayer />
    </div>
  );
};
